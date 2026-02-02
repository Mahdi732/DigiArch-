import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UploadDocumentDto } from './dto/upload-document.dto';
import { DocumentEntity, DocumentEntityDocument } from './documents.schema';
import { slugify } from '../common/utils/slugify';
import { MinioService } from '../storage/minio.service';
import { LlmService } from '../llm/llm.service';
import { SearchDocumentDto } from './dto/search-document.dto';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectModel(DocumentEntity.name)
    private readonly documentModel: Model<DocumentEntityDocument>,
    private readonly minioService: MinioService,
    private readonly llmService: LlmService,
  ) {}

  private computeFolder(dto: UploadDocumentDto): { folder: string; baseFileName: string } {
    const last = slugify(dto.lastName);
    const first = slugify(dto.firstName);
    const department = slugify(dto.department);
    const docType = slugify(dto.documentType);
    const hasCin = Boolean(dto.cin && dto.cin.trim().length > 0);

    if (hasCin) {
      const cin = slugify(dto.cin as string);
      return {
        folder: `${last}_${first}_${cin}/${department}/${docType}/`,
        baseFileName: docType,
      };
    }

    return {
      folder: `${department}/${docType}_${last}_${first}/`,
      baseFileName: docType,
    };
  }

  private async resolveUniqueFileName(folder: string, baseFileName: string): Promise<string> {
    let counter = 0;
    while (true) {
      const suffix = counter === 0 ? '' : `${counter}`;
      const candidate = `${baseFileName}${suffix}.pdf`;
      const objectKey = `${folder}${candidate}`;
      const exists = await this.minioService.objectExists(objectKey);
      if (!exists) {
        return candidate;
      }
      counter += 1;
    }
  }

  async upload(file: Express.Multer.File, dto: UploadDocumentDto): Promise<DocumentEntity> {
    if (!file) {
      throw new BadRequestException('PDF file is required');
    }

    const { folder, baseFileName } = this.computeFolder(dto);
    const uniqueFileName = await this.resolveUniqueFileName(folder, baseFileName);
    const objectKey = `${folder}${uniqueFileName}`;

    const metadata = await this.llmService.extractMetadata(file.buffer, {
      firstName: dto.firstName,
      lastName: dto.lastName,
      cin: dto.cin,
      department: dto.department,
      documentType: dto.documentType,
    });

    await this.minioService.uploadObject(objectKey, file.buffer, {
      'Content-Type': 'application/pdf',
    });

    const metadataPayload = {
      department_description: metadata.department_description ?? dto.department,
      document_description: metadata.document_description ?? dto.documentDescription ?? '',
      document_type: metadata.document_type ?? dto.documentType,
      document_status: metadata.document_status ?? 'pending',
      signature_detected: metadata.signature_detected ?? false,
      human_verification_required: metadata.human_verification_required ?? true,
      scan_date: metadata.scan_date ?? new Date().toISOString(),
      archiving_manager: metadata.archiving_manager ?? '',
      owner_firstname: metadata.owner_firstname ?? dto.firstName,
      owner_lastname: metadata.owner_lastname ?? dto.lastName,
      owner_cin: metadata.owner_cin ?? dto.cin,
    };

    const metadataObjectKey = `${folder}metadata.json`;
    await this.minioService.uploadObject(
      metadataObjectKey,
      Buffer.from(JSON.stringify(metadataPayload, null, 2)),
      {
        'Content-Type': 'application/json',
      },
    );

    const created = await this.documentModel.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      cin: dto.cin,
      department: dto.department,
      documentType: dto.documentType,
      documentStatus: metadataPayload.document_status,
      signatureDetected: metadataPayload.signature_detected,
      humanVerificationRequired: metadataPayload.human_verification_required,
      scanDate: metadataPayload.scan_date,
      archivingManager: metadataPayload.archiving_manager,
      storagePath: folder,
      fileName: uniqueFileName,
      metadataObjectPath: metadataObjectKey,
      metadata: metadataPayload,
    });

    return created;
  }

  async search(query: SearchDocumentDto): Promise<DocumentEntity[]> {
    const filters: Record<string, any> = {};
    if (query.firstName) filters.firstName = new RegExp(query.firstName, 'i');
    if (query.lastName) filters.lastName = new RegExp(query.lastName, 'i');
    if (query.cin) filters.cin = new RegExp(query.cin, 'i');
    if (query.department) filters.department = new RegExp(query.department, 'i');
    if (query.documentType) filters.documentType = new RegExp(query.documentType, 'i');

    return this.documentModel.find(filters).sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<DocumentEntity> {
    const doc = await this.documentModel.findById(id).exec();
    if (!doc) {
      throw new NotFoundException('Document not found');
    }
    return doc;
  }
}
