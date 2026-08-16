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

import { CreateCaseDto } from '../dto/create-case.dto';
import { UpdateCaseDto } from '../dto/update-case.dto';

import { CaseRepository } from '../repositories/case.repository';
import { CaseAuditService } from './case-audit.service';

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

  async update(id: string, dto: UpdateCaseDto) {
    const caseItem = await this.repository.findById(id);

    if (!caseItem) {
      throw new NotFoundException('Case not found');
    }

    /*
     * Case status is workflow-controlled.
     * It must never be changed through the generic PATCH endpoint.
     */
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

  /*
   * ---------------------------------------------------------
   * CASE WORKFLOW
   * ---------------------------------------------------------
   *
   * DRAFT
   *   -> SUBMITTED
   *
   * SUBMITTED
   *   -> UNDER_REVIEW
   *
   * UNDER_REVIEW
   *   -> NEED_DOCUMENT
   *   -> APPROVED
   *   -> REJECTED
   *
   * NEED_DOCUMENT
   *   -> UNDER_REVIEW
   *
   * APPROVED
   *   -> COMPLETED
   *
   * Most non-terminal states
   *   -> CANCELLED
   *
   * Terminal:
   *   COMPLETED
   *   REJECTED
   *   CANCELLED
   */

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

    /*
     * APPROVAL TRANSITION GATE
     *
     * Approval is only valid from UNDER_REVIEW.
     */
    this.assertTransition(
      caseItem.status,
      CaseStatus.UNDER_REVIEW,
      CaseStatus.APPROVED,
    );

    const documents =
      await this.repository.findDocumentsByCaseId(id);

    /*
     * APPROVAL GATE #1
     *
     * A case cannot be approved without documents.
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

    /*
     * APPROVAL GATE #2
     *
     * Every document must be VERIFIED.
     */
    const unverifiedDocuments = documents.filter(
      (document) =>
        document.status !== CaseDocumentStatus.VERIFIED,
    );

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
     *
     * At this point:
     * - Case is UNDER_REVIEW
     * - At least one document exists
     * - Every document is VERIFIED
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

    /*
     * Terminal states cannot be cancelled.
     */
    if (this.isTerminalStatus(caseItem.status)) {
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

    /*
     * Deletion is deliberately kept separate from the workflow.
     *
     * We do not introduce a new audit enum value here yet because
     * the current CaseAuditAction enum does not contain DELETED.
     *
     * The database deletion therefore remains the repository
     * responsibility, while workflow auditing remains explicit.
     */
    return this.repository.remove(id);
  }

  /*
   * ---------------------------------------------------------
   * WORKFLOW HELPERS
   * ---------------------------------------------------------
   */

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

    this.assertTransition(caseItem.status, from, to);

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

  private assertTransition(
    currentStatus: CaseStatus,
    expectedFrom: CaseStatus,
    toStatus: CaseStatus,
  ) {
    if (currentStatus !== expectedFrom) {
      throw new BadRequestException(
        `Invalid case transition: ${currentStatus} -> ${toStatus}`,
      );
    }

    if (!this.isAllowedTransition(currentStatus, toStatus)) {
      throw new BadRequestException(
        `Workflow transition is not allowed: ${currentStatus} -> ${toStatus}`,
      );
    }
  }

  private isAllowedTransition(
    from: CaseStatus,
    to: CaseStatus,
  ): boolean {
    const transitions: Record<
      CaseStatus,
      CaseStatus[]
    > = {
      [CaseStatus.DRAFT]: [
        CaseStatus.SUBMITTED,
        CaseStatus.CANCELLED,
      ],

      [CaseStatus.SUBMITTED]: [
        CaseStatus.UNDER_REVIEW,
        CaseStatus.CANCELLED,
      ],

      [CaseStatus.UNDER_REVIEW]: [
        CaseStatus.NEED_DOCUMENT,
        CaseStatus.APPROVED,
        CaseStatus.REJECTED,
        CaseStatus.CANCELLED,
      ],

      [CaseStatus.NEED_DOCUMENT]: [
        CaseStatus.UNDER_REVIEW,
        CaseStatus.CANCELLED,
      ],

      [CaseStatus.APPROVED]: [
        CaseStatus.COMPLETED,
        CaseStatus.CANCELLED,
      ],

      [CaseStatus.REJECTED]: [],

      [CaseStatus.COMPLETED]: [],

      [CaseStatus.CANCELLED]: [],
    };

    return transitions[from]?.includes(to) ?? false;
  }

  private isTerminalStatus(
    status: CaseStatus,
  ): boolean {
    return (
      status === CaseStatus.COMPLETED ||
      status === CaseStatus.REJECTED ||
      status === CaseStatus.CANCELLED
    );
  }
}