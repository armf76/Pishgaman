import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  CaseAuditAction,
  CaseDocumentStatus,
  CaseStatus,
} from '@prisma/client';

import { CaseRepository } from '../repositories/case.repository';
import { CaseAuditService } from './case-audit.service';

import { CreateCaseDto } from '../dto/create-case.dto';
import { UpdateCaseDto } from '../dto/update-case.dto';

@Injectable()
export class CaseService {
  constructor(
    private readonly repository: CaseRepository,
    private readonly auditService: CaseAuditService,
  ) {}

  async create(dto: CreateCaseDto) {
    const caseItem = await this.repository.create(dto);

    await this.auditService.create({
      caseId: caseItem.id,
      action: CaseAuditAction.CREATED,
      toStatus: caseItem.status,
      description: 'Case created',
      metadata: {
        caseNumber: caseItem.caseNumber,
        applicantPartyId: caseItem.applicantPartyId,
        title: caseItem.title,
      },
    });

    return caseItem;
  }

  findAll() {
    return this.repository.findAll();
  }

  async findOne(id: string) {
    const caseItem = await this.repository.findById(id);

    if (!caseItem) {
      throw new NotFoundException('Case not found');
    }

    return caseItem;
  }

  async update(
    id: string,
    dto: UpdateCaseDto,
  ) {
    const caseItem = await this.repository.findById(id);

    if (!caseItem) {
      throw new NotFoundException('Case not found');
    }

    if (dto.status !== undefined) {
      throw new BadRequestException(
        'Case status must be changed through a workflow action',
      );
    }

    const updatedCase = await this.repository.update(id, dto);

    await this.auditService.create({
      caseId: id,
      action: CaseAuditAction.UPDATED,
      fromStatus: caseItem.status,
      toStatus: updatedCase.status,
      description: 'Case information updated',
      metadata: {
        titleChanged: dto.title !== undefined,
        descriptionChanged: dto.description !== undefined,
      },
    });

    return updatedCase;
  }

  async submit(id: string) {
    return this.transition(
      id,
      CaseStatus.DRAFT,
      CaseStatus.SUBMITTED,
      CaseAuditAction.SUBMITTED,
      'Case submitted',
    );
  }

  async startReview(id: string) {
    return this.transition(
      id,
      CaseStatus.SUBMITTED,
      CaseStatus.UNDER_REVIEW,
      CaseAuditAction.REVIEWED,
      'Case review started',
    );
  }

  async requestDocuments(id: string) {
    return this.transition(
      id,
      CaseStatus.UNDER_REVIEW,
      CaseStatus.NEED_DOCUMENT,
      CaseAuditAction.DOCUMENT_REQUESTED,
      'Additional documents requested',
    );
  }

  async resubmitForReview(id: string) {
    return this.transition(
      id,
      CaseStatus.NEED_DOCUMENT,
      CaseStatus.UNDER_REVIEW,
      CaseAuditAction.RESUBMITTED,
      'Case resubmitted for review',
    );
  }

  async approve(id: string) {
    const caseItem = await this.repository.findById(id);

    if (!caseItem) {
      throw new NotFoundException('Case not found');
    }

    if (caseItem.status !== CaseStatus.UNDER_REVIEW) {
      throw new BadRequestException(
        `Invalid case transition: ${caseItem.status} -> ${CaseStatus.APPROVED}`,
      );
    }

    const documents =
      await this.repository.findDocumentsByCaseId(id);

    /*
     * APPROVAL GATE #1
     * No documents exist.
     */
    if (documents.length === 0) {
      await this.auditService.create({
        caseId: id,
        action: CaseAuditAction.APPROVAL_BLOCKED,
        fromStatus: CaseStatus.UNDER_REVIEW,
        toStatus: CaseStatus.UNDER_REVIEW,
        description:
          'Case approval blocked: no documents exist',
        metadata: {
          reason: 'NO_DOCUMENTS',
          documentCount: 0,
        },
      });

      throw new BadRequestException(
        'Case cannot be approved without documents.',
      );
    }

    const unverifiedDocuments = documents.filter(
      (document) =>
        document.status !== CaseDocumentStatus.VERIFIED,
    );

    /*
     * APPROVAL GATE #2
     * At least one document exists but not all
     * documents are VERIFIED.
     */
    if (unverifiedDocuments.length > 0) {
      const documentSummary = unverifiedDocuments
        .map(
          (document) =>
            `${document.type}: ${document.status}`,
        )
        .join(', ');

      await this.auditService.create({
        caseId: id,
        action: CaseAuditAction.APPROVAL_BLOCKED,
        fromStatus: CaseStatus.UNDER_REVIEW,
        toStatus: CaseStatus.UNDER_REVIEW,
        description:
          'Case approval blocked: unverified documents exist',
        metadata: {
          reason: 'UNVERIFIED_DOCUMENTS',
          documentCount: documents.length,
          unverifiedDocumentCount:
            unverifiedDocuments.length,
          unverifiedDocuments: unverifiedDocuments.map(
            (document) => ({
              documentId: document.id,
              type: document.type,
              status: document.status,
            }),
          ),
        },
      });

      throw new BadRequestException(
        `Case cannot be approved. All documents must be VERIFIED. Unverified documents: ${documentSummary}`,
      );
    }

    /*
     * APPROVAL PASSED
     * All documents are VERIFIED.
     */
    const updatedCase = await this.repository.update(id, {
      status: CaseStatus.APPROVED,
    });

    await this.auditService.create({
      caseId: id,
      action: CaseAuditAction.APPROVED,
      fromStatus: CaseStatus.UNDER_REVIEW,
      toStatus: CaseStatus.APPROVED,
      description: 'Case approved',
      metadata: {
        documentCount: documents.length,
      },
    });

    return updatedCase;
  }

  async reject(id: string) {
    return this.transition(
      id,
      CaseStatus.UNDER_REVIEW,
      CaseStatus.REJECTED,
      CaseAuditAction.REJECTED,
      'Case rejected',
    );
  }

  async complete(id: string) {
    return this.transition(
      id,
      CaseStatus.APPROVED,
      CaseStatus.COMPLETED,
      CaseAuditAction.COMPLETED,
      'Case completed',
    );
  }

  async cancel(id: string) {
    const caseItem = await this.repository.findById(id);

    if (!caseItem) {
      throw new NotFoundException('Case not found');
    }

    if (
      caseItem.status === CaseStatus.COMPLETED ||
      caseItem.status === CaseStatus.REJECTED ||
      caseItem.status === CaseStatus.CANCELLED
    ) {
      throw new BadRequestException(
        `Case cannot be cancelled from status ${caseItem.status}`,
      );
    }

    const updatedCase = await this.repository.update(id, {
      status: CaseStatus.CANCELLED,
    });

    await this.auditService.create({
      caseId: id,
      action: CaseAuditAction.CANCELLED,
      fromStatus: caseItem.status,
      toStatus: CaseStatus.CANCELLED,
      description: 'Case cancelled',
    });

    return updatedCase;
  }

  async remove(id: string) {
    const caseItem = await this.repository.findById(id);

    if (!caseItem) {
      throw new NotFoundException('Case not found');
    }

    const result = await this.repository.remove(id);

    /*
     * The Case record is deleted, but the audit record remains
     * so the deletion itself is traceable.
     */
    await this.auditService.create({
      caseId: id,
      action: CaseAuditAction.CANCELLED,
      fromStatus: caseItem.status,
      description: 'Case deleted',
      metadata: {
        deleted: true,
        caseNumber: caseItem.caseNumber,
        title: caseItem.title,
        previousStatus: caseItem.status,
      },
    });

    return result;
  }

  private async transition(
    id: string,
    from: CaseStatus,
    to: CaseStatus,
    action: CaseAuditAction,
    description: string,
  ) {
    const caseItem = await this.repository.findById(id);

    if (!caseItem) {
      throw new NotFoundException('Case not found');
    }

    if (caseItem.status !== from) {
      throw new BadRequestException(
        `Invalid case transition: ${caseItem.status} -> ${to}`,
      );
    }

    const updatedCase = await this.repository.update(id, {
      status: to,
    });

    await this.auditService.create({
      caseId: id,
      action,
      fromStatus: from,
      toStatus: to,
      description,
    });

    return updatedCase;
  }
}