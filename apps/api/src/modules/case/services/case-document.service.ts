import { Injectable } from '@nestjs/common';

import { CaseAuditAction } from '@prisma/client';

import { CaseAuditService } from './case-audit.service';
import { CaseDocumentRepository } from '../repositories/case-document.repository';

import { CreateCaseDocumentDto } from '../dto/create-case-document.dto';
import { UpdateCaseDocumentDto } from '../dto/update-case-document.dto';

@Injectable()
export class CaseDocumentService {
  constructor(
    private readonly repository: CaseDocumentRepository,
    private readonly auditService: CaseAuditService,
  ) {}

  async create(
    caseId: string,
    dto: CreateCaseDocumentDto,
  ) {
    const document = await this.repository.create(
      caseId,
      dto,
    );

    await this.auditService.create({
      caseId,
      action: CaseAuditAction.DOCUMENT_CREATED,
      documentId: document.id,
      description: 'Case document created',
      metadata: {
        type: document.type,
        title: document.title,
        status: document.status,
      },
    });

    return document;
  }

  findAllByCaseId(caseId: string) {
    return this.repository.findAllByCaseId(caseId);
  }

  findOne(id: string) {
    return this.repository.findById(id);
  }

  async update(
    id: string,
    dto: UpdateCaseDocumentDto,
  ) {
    const before = await this.repository.findById(id);

    const document = await this.repository.update(
      id,
      dto,
    );

    await this.auditService.create({
      caseId: document.caseId,
      action: CaseAuditAction.DOCUMENT_UPDATED,
      documentId: document.id,
      description: 'Case document updated',
      metadata: {
        before: {
          type: before.type,
          title: before.title,
          status: before.status,
          filePath: before.filePath,
          rejectionReason: before.rejectionReason,
        },
        after: {
          type: document.type,
          title: document.title,
          status: document.status,
          filePath: document.filePath,
          rejectionReason: document.rejectionReason,
        },
      },
    });

    return document;
  }

  async upload(
    id: string,
    filePath: string,
  ) {
    const before = await this.repository.findById(id);

    const document = await this.repository.upload(
      id,
      filePath,
    );

    await this.auditService.create({
      caseId: document.caseId,
      action: CaseAuditAction.DOCUMENT_UPLOADED,
      documentId: document.id,
      description: 'Case document uploaded',
      metadata: {
        previousStatus: before.status,
        newStatus: document.status,
        filePath: document.filePath,
      },
    });

    return document;
  }

  async verify(id: string) {
    const before = await this.repository.findById(id);

    const document = await this.repository.verify(id);

    await this.auditService.create({
      caseId: document.caseId,
      action: CaseAuditAction.DOCUMENT_VERIFIED,
      documentId: document.id,
      description: 'Case document verified',
      metadata: {
        previousStatus: before.status,
        newStatus: document.status,
        verifiedAt: document.verifiedAt,
      },
    });

    return document;
  }

  async reject(
    id: string,
    rejectionReason: string,
  ) {
    const before = await this.repository.findById(id);

    const document = await this.repository.reject(
      id,
      rejectionReason,
    );

    await this.auditService.create({
      caseId: document.caseId,
      action: CaseAuditAction.DOCUMENT_REJECTED,
      documentId: document.id,
      description: 'Case document rejected',
      metadata: {
        previousStatus: before.status,
        newStatus: document.status,
        rejectionReason: document.rejectionReason,
      },
    });

    return document;
  }

  async remove(id: string) {
    const document = await this.repository.findById(id);

    const result = await this.repository.remove(id);

    await this.auditService.create({
      caseId: document.caseId,
      action: CaseAuditAction.DOCUMENT_DELETED,
      documentId: document.id,
      description: 'Case document deleted',
      metadata: {
        deleted: true,
        type: document.type,
        title: document.title,
        previousStatus: document.status,
      },
    });

    return result;
  }
}