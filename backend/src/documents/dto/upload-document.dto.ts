import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class UploadDocumentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  lastName: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  cin?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  department: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  documentType: string;

  @IsString()
  @IsOptional()
  @MaxLength(250)
  documentDescription?: string;
}
