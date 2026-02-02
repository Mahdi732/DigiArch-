import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface ExtractedMetadata {
  department_description?: string;
  document_description?: string;
  document_type?: string;
  document_status?: 'valid' | 'incomplete' | 'pending';
  signature_detected?: boolean;
  human_verification_required?: boolean;
  scan_date?: string;
  archiving_manager?: string;
  owner_firstname?: string;
  owner_lastname?: string;
  owner_cin?: string;
}

interface BaseUploadContext {
  firstName: string;
  lastName: string;
  cin?: string;
  department: string;
  documentType: string;
}

@Injectable()
export class LlmService {
  private readonly logger = new Logger(LlmService.name);
  private readonly apiKey: string | undefined;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('OPENAI_API_KEY');
  }

  async extractMetadata(_file: Buffer, context: BaseUploadContext): Promise<ExtractedMetadata> {
    if (!this.apiKey) {
      // Fallback when no LLM key is configured.
      return {
        owner_firstname: context.firstName,
        owner_lastname: context.lastName,
        owner_cin: context.cin,
        department_description: context.department,
        document_type: context.documentType,
        document_status: 'pending',
        signature_detected: false,
        human_verification_required: true,
        archiving_manager: this.configService.get<string>('ARCHIVING_MANAGER_NAME', 'automation-bot'),
        scan_date: new Date().toISOString(),
      };
    }

    // Placeholder for real LLM integration. Could be wired to OpenAI or Azure OpenAI.
    this.logger.warn('OPENAI_API_KEY provided but LLM call is not implemented; returning fallback metadata.');
    return {
      owner_firstname: context.firstName,
      owner_lastname: context.lastName,
      owner_cin: context.cin,
      department_description: context.department,
      document_type: context.documentType,
      document_description: 'LLM extraction placeholder',
      document_status: 'pending',
      signature_detected: false,
      human_verification_required: true,
      archiving_manager: this.configService.get<string>('ARCHIVING_MANAGER_NAME', 'automation-bot'),
      scan_date: new Date().toISOString(),
    };
  }
}
