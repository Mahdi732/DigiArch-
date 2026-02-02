import { IsOptional, IsString, MaxLength } from 'class-validator';

export class SearchDocumentDto {
  @IsString()
  @IsOptional()
  @MaxLength(80)
  firstName?: string;

  @IsString()
  @IsOptional()
  @MaxLength(80)
  lastName?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  cin?: string;

  @IsString()
  @IsOptional()
  @MaxLength(80)
  department?: string;

  @IsString()
  @IsOptional()
  @MaxLength(120)
  documentType?: string;
}
