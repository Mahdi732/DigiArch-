import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document as MongooseDocument } from 'mongoose';

@Schema({ timestamps: true })
export class DocumentEntity {
  @Prop({ required: true })
  firstName!: string;

  @Prop({ required: true })
  lastName!: string;

  @Prop({ required: false })
  cin?: string;

  @Prop({ required: true })
  department!: string;

  @Prop({ required: true })
  documentType!: string;

  @Prop({ default: 'pending' })
  documentStatus!: 'valid' | 'incomplete' | 'pending';

  @Prop({ default: false })
  signatureDetected!: boolean;

  @Prop({ default: true })
  humanVerificationRequired!: boolean;

  @Prop({ default: () => new Date().toISOString() })
  scanDate!: string;

  @Prop({ default: '' })
  archivingManager!: string;

  @Prop({ required: true })
  storagePath!: string;

  @Prop({ required: true })
  fileName!: string;

  @Prop({ required: true })
  metadataObjectPath!: string;

  @Prop({ type: Object })
  metadata!: Record<string, any>;
}

export type DocumentEntityDocument = DocumentEntity & MongooseDocument;
export const DocumentSchema = SchemaFactory.createForClass(DocumentEntity);
