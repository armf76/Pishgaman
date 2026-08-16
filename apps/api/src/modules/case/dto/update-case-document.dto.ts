import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

import {
  CaseDocumentStatus,
  CaseDocumentType,
} from '@prisma/client';

export class UpdateCaseDocumentDto {
  @ApiPropertyOptional({ enum: CaseDocumentType })
  @IsOptional()
  @IsEnum(CaseDocumentType)
  type?: CaseDocumentType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ enum: CaseDocumentStatus })
  @IsOptional()
  @IsEnum(CaseDocumentStatus)
  status?: CaseDocumentStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  filePath?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  rejectionReason?: string;
}