import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { CaseDocumentService } from '../services/case-document.service';
import { CreateCaseDocumentDto } from '../dto/create-case-document.dto';
import { UpdateCaseDocumentDto } from '../dto/update-case-document.dto';

@Controller('cases/:caseId/documents')
export class CaseDocumentController {
  constructor(
    private readonly service: CaseDocumentService,
  ) {}

  @Post()
  create(
    @Param('caseId') caseId: string,
    @Body() dto: CreateCaseDocumentDto,
  ) {
    return this.service.create(caseId, dto);
  }

  @Get()
  findAll(
    @Param('caseId') caseId: string,
  ) {
    return this.service.findAllByCaseId(caseId);
  }

  @Post(':id/upload')
  upload(
    @Param('id') id: string,
    @Body() body: { filePath: string },
  ) {
    return this.service.upload(
      id,
      body.filePath,
    );
  }

  @Post(':id/verify')
  verify(
    @Param('id') id: string,
  ) {
    return this.service.verify(id);
  }

  @Post(':id/reject')
  reject(
    @Param('id') id: string,
    @Body() body: { rejectionReason: string },
  ) {
    return this.service.reject(
      id,
      body.rejectionReason,
    );
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
  ) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCaseDocumentDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
  ) {
    return this.service.remove(id);
  }
}