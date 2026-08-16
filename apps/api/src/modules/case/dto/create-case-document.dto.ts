import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

import {
  CaseDocumentStatus,
  CaseDocumentType,
} from '@prisma/client';

export class CreateCaseDocumentDto {
  @ApiProperty({ enum: CaseDocumentType })
  @IsEnum(CaseDocumentType)
  type!: CaseDocumentType;

  @ApiProperty()
  @IsString()
  title!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  filePath?: string;

  @ApiPropertyOptional({ enum: CaseDocumentStatus })
  @IsOptional()
  @IsEnum(CaseDocumentStatus)
  status?: CaseDocumentStatus;
}