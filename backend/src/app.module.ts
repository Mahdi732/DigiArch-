import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentsModule } from './documents/documents.module';
import { LlmModule } from './llm/llm.module';
import { StorageModule } from './storage/storage.module';
import { MongoMemoryServer } from 'mongodb-memory-server';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const providedUri = config.get<string>('MONGO_URI');
        const useInMemory = config.get<string>('MONGO_IN_MEMORY') === 'true' || !providedUri;

        if (useInMemory) {
          const mongod = await MongoMemoryServer.create({ instance: { dbName: 'digiarch' } });
          const uri = mongod.getUri();
          console.warn(`Using in-memory MongoDB at ${uri} (set MONGO_URI to disable)`);
          return { uri };
        }

        return { uri: providedUri };
      },
    }),
    StorageModule,
    LlmModule,
    DocumentsModule,
  ],
})
export class AppModule {}
