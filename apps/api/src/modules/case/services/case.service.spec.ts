import { BadRequestException, NotFoundException } from '@nestjs/common';

import {
  CaseAuditAction,
  CaseDocumentStatus,
  CaseStatus,
} from '@prisma/client';

import { CaseService } from './case.service';
import { CaseRepository } from '../repositories/case.repository';
import { CaseAuditService } from './case-audit.service';

describe('CaseService', () => {
  let service: CaseService;

  let repository: {
    create: jest.Mock;
    findAll: jest.Mock;
    findById: jest.Mock;
    update: jest.Mock;
    remove: jest.Mock;
    findDocumentsByCaseId: jest.Mock;
  };

  let auditService: {
    create: jest.Mock;
  };

  const caseId = 'case-test-id';

  const baseCase = {
    id: caseId,
    caseNumber: 'PGM-TEST-000001',
    applicantPartyId: 'applicant-test-id',
    title: 'Test Case',
    description: 'Test case description',
    status: CaseStatus.DRAFT,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      findDocumentsByCaseId: jest.fn(),
    };

    auditService = {
      create: jest.fn(),
    };

    service = new CaseService(
      repository as unknown as CaseRepository,
      auditService as unknown as CaseAuditService,
    );
  });

  describe('submit', () => {
    it('should move DRAFT to SUBMITTED and create audit entry', async () => {
      const draftCase = {
        ...baseCase,
        status: CaseStatus.DRAFT,
      };

      const submittedCase = {
        ...draftCase,
        status: CaseStatus.SUBMITTED,
      };

      repository.findById.mockResolvedValue(draftCase);
      repository.update.mockResolvedValue(submittedCase);

      const result = await service.submit(caseId);

      expect(result.status).toBe(CaseStatus.SUBMITTED);

      expect(repository.update).toHaveBeenCalledWith(caseId, {
        status: CaseStatus.SUBMITTED,
      });

      expect(auditService.create).toHaveBeenCalledWith({
        caseId,
        action: CaseAuditAction.SUBMITTED,
        fromStatus: CaseStatus.DRAFT,
        toStatus: CaseStatus.SUBMITTED,
        description: 'Case submitted',
      });
    });

    it('should reject submit when case is not DRAFT', async () => {
      repository.findById.mockResolvedValue({
        ...baseCase,
        status: CaseStatus.UNDER_REVIEW,
      });

      await expect(service.submit(caseId)).rejects.toThrow(
        BadRequestException,
      );

      expect(repository.update).not.toHaveBeenCalled();
      expect(auditService.create).not.toHaveBeenCalled();
    });
  });

  describe('startReview', () => {
    it('should move SUBMITTED to UNDER_REVIEW', async () => {
      const submittedCase = {
        ...baseCase,
        status: CaseStatus.SUBMITTED,
      };

      const reviewCase = {
        ...submittedCase,
        status: CaseStatus.UNDER_REVIEW,
      };

      repository.findById.mockResolvedValue(submittedCase);
      repository.update.mockResolvedValue(reviewCase);

      const result = await service.startReview(caseId);

      expect(result.status).toBe(CaseStatus.UNDER_REVIEW);

      expect(repository.update).toHaveBeenCalledWith(caseId, {
        status: CaseStatus.UNDER_REVIEW,
      });

      expect(auditService.create).toHaveBeenCalledWith({
        caseId,
        action: CaseAuditAction.REVIEWED,
        fromStatus: CaseStatus.SUBMITTED,
        toStatus: CaseStatus.UNDER_REVIEW,
        description: 'Case review started',
      });
    });
  });

  describe('approve', () => {
    it('should block approval when no documents exist', async () => {
      repository.findById.mockResolvedValue({
        ...baseCase,
        status: CaseStatus.UNDER_REVIEW,
      });

      repository.findDocumentsByCaseId.mockResolvedValue([]);

      await expect(service.approve(caseId)).rejects.toThrow(
        'Case cannot be approved without documents.',
      );

      expect(repository.update).not.toHaveBeenCalled();

      expect(auditService.create).toHaveBeenCalledWith({
        caseId,
        action: CaseAuditAction.APPROVAL_BLOCKED,
        fromStatus: CaseStatus.UNDER_REVIEW,
        toStatus: CaseStatus.UNDER_REVIEW,
        description: 'Case approval blocked: no documents exist',
        metadata: {
          reason: 'NO_DOCUMENTS',
          documentCount: 0,
        },
      });
    });

    it('should block approval when a document is not VERIFIED', async () => {
      const document = {
        id: 'document-test-id',
        caseId,
        type: 'OWNERSHIP_DOCUMENT',
        title: 'Required Ownership Document',
        status: CaseDocumentStatus.REQUIRED,
      };

      repository.findById.mockResolvedValue({
        ...baseCase,
        status: CaseStatus.UNDER_REVIEW,
      });

      repository.findDocumentsByCaseId.mockResolvedValue([document]);

      await expect(service.approve(caseId)).rejects.toThrow(
        'Case cannot be approved.',
      );

      expect(repository.update).not.toHaveBeenCalled();

      expect(auditService.create).toHaveBeenCalledWith({
        caseId,
        action: CaseAuditAction.APPROVAL_BLOCKED,
        fromStatus: CaseStatus.UNDER_REVIEW,
        toStatus: CaseStatus.UNDER_REVIEW,
        description:
          'Case approval blocked: unverified documents exist',
        metadata: {
          reason: 'UNVERIFIED_DOCUMENTS',
          documentCount: 1,
          unverifiedDocumentCount: 1,
          unverifiedDocuments: [
            {
              documentId: document.id,
              type: document.type,
              status: document.status,
            },
          ],
        },
      });
    });

    it('should approve the case when all documents are VERIFIED', async () => {
      const document = {
        id: 'document-test-id',
        caseId,
        type: 'OWNERSHIP_DOCUMENT',
        title: 'Required Ownership Document',
        status: CaseDocumentStatus.VERIFIED,
      };

      const reviewCase = {
        ...baseCase,
        status: CaseStatus.UNDER_REVIEW,
      };

      const approvedCase = {
        ...reviewCase,
        status: CaseStatus.APPROVED,
      };

      repository.findById.mockResolvedValue(reviewCase);
      repository.findDocumentsByCaseId.mockResolvedValue([document]);
      repository.update.mockResolvedValue(approvedCase);

      const result = await service.approve(caseId);

      expect(result.status).toBe(CaseStatus.APPROVED);

      expect(repository.update).toHaveBeenCalledWith(caseId, {
        status: CaseStatus.APPROVED,
      });

      expect(auditService.create).toHaveBeenCalledWith({
        caseId,
        action: CaseAuditAction.APPROVED,
        fromStatus: CaseStatus.UNDER_REVIEW,
        toStatus: CaseStatus.APPROVED,
        description: 'Case approved',
        metadata: {
          documentCount: 1,
        },
      });
    });

    it('should reject approval when case is not UNDER_REVIEW', async () => {
      repository.findById.mockResolvedValue({
        ...baseCase,
        status: CaseStatus.COMPLETED,
      });

      await expect(service.approve(caseId)).rejects.toThrow(
        'Invalid case transition: COMPLETED -> APPROVED',
      );

      expect(repository.findDocumentsByCaseId).not.toHaveBeenCalled();
      expect(repository.update).not.toHaveBeenCalled();
      expect(auditService.create).not.toHaveBeenCalled();
    });
  });

  describe('complete', () => {
    it('should move APPROVED to COMPLETED and create audit entry', async () => {
      const approvedCase = {
        ...baseCase,
        status: CaseStatus.APPROVED,
      };

      const completedCase = {
        ...approvedCase,
        status: CaseStatus.COMPLETED,
      };

      repository.findById.mockResolvedValue(approvedCase);
      repository.update.mockResolvedValue(completedCase);

      const result = await service.complete(caseId);

      expect(result.status).toBe(CaseStatus.COMPLETED);

      expect(repository.update).toHaveBeenCalledWith(caseId, {
        status: CaseStatus.COMPLETED,
      });

      expect(auditService.create).toHaveBeenCalledWith({
        caseId,
        action: CaseAuditAction.COMPLETED,
        fromStatus: CaseStatus.APPROVED,
        toStatus: CaseStatus.COMPLETED,
        description: 'Case completed',
      });
    });

    it('should reject completion when case is not APPROVED', async () => {
      repository.findById.mockResolvedValue({
        ...baseCase,
        status: CaseStatus.UNDER_REVIEW,
      });

      await expect(service.complete(caseId)).rejects.toThrow(
        BadRequestException,
      );

      expect(repository.update).not.toHaveBeenCalled();
      expect(auditService.create).not.toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException when case does not exist', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.findOne(caseId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});