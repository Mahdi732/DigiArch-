import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'minio';
import { promises as fs } from 'fs';
import * as path from 'path';

@Injectable()
export class MinioService {
  private readonly client: Client;
  private readonly bucket: string;
  private readonly logger = new Logger(MinioService.name);
  private readonly useLocal: boolean;
  private readonly localBase: string;

  constructor(private readonly configService: ConfigService) {
    this.bucket = this.configService.get<string>('MINIO_BUCKET', 'ged-documents');
    // Default to local storage when running without a MinIO daemon.
    this.useLocal = this.configService.get<string>('MINIO_DISABLED', 'true') === 'true';
    this.localBase = path.join(process.cwd(), 'local-storage');

    if (this.useLocal) {
      this.logger.warn('MINIO_DISABLED=true -> using local filesystem storage.');
      // Avoid initializing client when disabled.
      // @ts-expect-error keep undefined when local fallback is active.
      this.client = undefined;
      return;
    }

    const endPoint = this.configService.get<string>('MINIO_ENDPOINT', 'localhost');
    const port = Number(this.configService.get<string>('MINIO_PORT', '9000'));
    const useSSL = this.configService.get<string>('MINIO_USE_SSL', 'false') === 'true';
    const accessKey = this.configService.get<string>('MINIO_ACCESS_KEY', 'minioadmin');
    const secretKey = this.configService.get<string>('MINIO_SECRET_KEY', 'minioadmin');

    this.client = new Client({ endPoint, port, useSSL, accessKey, secretKey });
    this.logger.log(`MinIO target ${endPoint}:${port} (ssl=${useSSL})`);
  }

  async ensureBucketExists(): Promise<void> {
    if (this.useLocal) {
      const bucketDir = path.join(this.localBase, this.bucket);
      await fs.mkdir(bucketDir, { recursive: true });
      return;
    }
    const exists = await this.client.bucketExists(this.bucket).catch(() => false);
    if (!exists) {
      this.logger.log(`Creating bucket ${this.bucket}`);
      await this.client.makeBucket(this.bucket, '');
    }
  }

  async uploadObject(objectName: string, buffer: Buffer, meta?: Record<string, string>): Promise<void> {
    if (this.useLocal) {
      const filePath = path.join(this.localBase, this.bucket, objectName);
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, buffer);
      return;
    }
    try {
      await this.ensureBucketExists();
      await this.client.putObject(this.bucket, objectName, buffer, meta);
    } catch (error: any) {
      this.logger.error(`MinIO upload failed: ${error?.message || error}`);
      throw new ServiceUnavailableException('Storage backend unreachable (MinIO).');
    }
  }

  async objectExists(objectName: string): Promise<boolean> {
    if (this.useLocal) {
      const filePath = path.join(this.localBase, this.bucket, objectName);
      try {
        await fs.access(filePath);
        return true;
      } catch {
        return false;
      }
    }
    try {
      await this.client.statObject(this.bucket, objectName);
      return true;
    } catch (error: any) {
      if (error?.code === 'NotFound') {
        return false;
      }
      this.logger.error(`MinIO stat failed: ${error?.message || error}`);
      throw new ServiceUnavailableException('Storage backend unreachable (MinIO).');
    }
  }
}
