import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

import { CaseDocumentType } from '@prisma/client';

export class UpdateCaseDocumentDto {
  @ApiPropertyOptional({ enum: CaseDocumentType })
  @IsOptional()
  @IsEnum(CaseDocumentType)
  type?: CaseDocumentType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;
}