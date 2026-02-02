import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';
import { UploadDocumentDto } from './dto/upload-document.dto';
import { SearchDocumentDto } from './dto/search-document.dto';
import { DocumentEntity } from './documents.schema';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UploadDocumentDto,
  ): Promise<DocumentEntity> {
    return this.documentsService.upload(file, body);
  }

  @Get('search')
  async search(@Query() query: SearchDocumentDto): Promise<DocumentEntity[]> {
    return this.documentsService.search(query);
  }

  // Constrain :id to a 24-hex Mongo ObjectId to avoid capturing paths like "upload" and throwing cast errors.
  @Get(':id([0-9a-fA-F]{24})')
  async findOne(@Param('id') id: string): Promise<DocumentEntity> {
    return this.documentsService.findOne(id);
  }
}
