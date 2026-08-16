import {
  CaseAuditAction,
  CaseDocumentType,
} from '@prisma/client';

import { CaseDocumentService } from './case-document.service';
import { CaseDocumentRepository } from '../repositories/case-document.repository';
import { CaseAuditService } from './case-audit.service';

describe('CaseDocumentService', () => {
  let service: CaseDocumentService;

  let repository: {
    create: jest.Mock;
    findAllByCaseId: jest.Mock;
    findById: jest.Mock;
    update: jest.Mock;
    upload: jest.Mock;
    verify: jest.Mock;
    reject: jest.Mock;
    remove: jest.Mock;
  };

  let auditService: {
    create: jest.Mock;
  };

  const caseId = 'case-test-id';
  const documentId = 'document-test-id';

  const requiredDocument = {
    id: documentId,
    caseId,
    type: CaseDocumentType.OWNERSHIP_DOCUMENT,
    title: 'Required Ownership Document',
    status: 'REQUIRED',
    filePath: null,
    rejectionReason: null,
    uploadedAt: null,
    verifiedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      findAllByCaseId: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      upload: jest.fn(),
      verify: jest.fn(),
      reject: jest.fn(),
      remove: jest.fn(),
    };

    auditService = {
      create: jest.fn(),
    };

    service = new CaseDocumentService(
      repository as unknown as CaseDocumentRepository,
      auditService as unknown as CaseAuditService,
    );
  });

  describe('create', () => {
    it('should create a document and audit DOCUMENT_CREATED', async () => {
      repository.create.mockResolvedValue(requiredDocument);

      const dto = {
        type: CaseDocumentType.OWNERSHIP_DOCUMENT,
        title: requiredDocument.title,
      };

      const result = await service.create(caseId, dto);

      expect(result).toEqual(requiredDocument);

      expect(repository.create).toHaveBeenCalledWith(
        caseId,
        dto,
      );

      expect(auditService.create).toHaveBeenCalledWith({
        caseId,
        action: CaseAuditAction.DOCUMENT_CREATED,
        documentId,
        description: 'Case document created',
        metadata: {
          type: requiredDocument.type,
          title: requiredDocument.title,
          status: requiredDocument.status,
        },
      });
    });
  });

  describe('findAllByCaseId', () => {
    it('should return all documents belonging to a case', async () => {
      const documents = [requiredDocument];

      repository.findAllByCaseId.mockResolvedValue(documents);

      const result =
        await service.findAllByCaseId(caseId);

      expect(result).toEqual(documents);

      expect(
        repository.findAllByCaseId,
      ).toHaveBeenCalledWith(caseId);
    });
  });

  describe('findOne', () => {
    it('should return the requested document', async () => {
      repository.findById.mockResolvedValue(
        requiredDocument,
      );

      const result = await service.findOne(documentId);

      expect(result).toEqual(requiredDocument);

      expect(repository.findById).toHaveBeenCalledWith(
        documentId,
      );
    });
  });

  describe('update', () => {
    it('should update the document and audit DOCUMENT_UPDATED', async () => {
      const before = {
        ...requiredDocument,
        title: 'Old Title',
        status: 'REQUIRED',
        filePath: null,
        rejectionReason: null,
      };

      const after = {
        ...before,
        title: 'Updated Title',
      };

      repository.findById.mockResolvedValue(before);
      repository.update.mockResolvedValue(after);

      const dto = {
        title: 'Updated Title',
      };

      const result = await service.update(
        documentId,
        dto,
      );

      expect(result).toEqual(after);

      expect(repository.findById).toHaveBeenCalledWith(
        documentId,
      );

      expect(repository.update).toHaveBeenCalledWith(
        documentId,
        dto,
      );

      expect(auditService.create).toHaveBeenCalledWith({
        caseId,
        action: CaseAuditAction.DOCUMENT_UPDATED,
        documentId,
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
            type: after.type,
            title: after.title,
            status: after.status,
            filePath: after.filePath,
            rejectionReason: after.rejectionReason,
          },
        },
      });
    });
  });

  describe('upload', () => {
    it('should upload the document and audit DOCUMENT_UPLOADED', async () => {
      const before = {
        ...requiredDocument,
        status: 'REQUIRED',
      };

      const after = {
        ...requiredDocument,
        status: 'UPLOADED',
        filePath: 'uploads/test-document.pdf',
        uploadedAt: new Date(),
      };

      repository.findById.mockResolvedValue(before);
      repository.upload.mockResolvedValue(after);

      const filePath =
        'uploads/test-document.pdf';

      const result = await service.upload(
        documentId,
        filePath,
      );

      expect(result).toEqual(after);

      expect(repository.findById).toHaveBeenCalledWith(
        documentId,
      );

      expect(repository.upload).toHaveBeenCalledWith(
        documentId,
        filePath,
      );

      expect(auditService.create).toHaveBeenCalledWith({
        caseId,
        action: CaseAuditAction.DOCUMENT_UPLOADED,
        documentId,
        description: 'Case document uploaded',
        metadata: {
          previousStatus: before.status,
          newStatus: after.status,
          filePath: after.filePath,
        },
      });
    });
  });

  describe('verify', () => {
    it('should verify the document and audit DOCUMENT_VERIFIED', async () => {
      const before = {
        ...requiredDocument,
        status: 'UPLOADED',
        filePath: 'uploads/test-document.pdf',
      };

      const verifiedAt = new Date();

      const after = {
        ...before,
        status: 'VERIFIED',
        verifiedAt,
      };

      repository.findById.mockResolvedValue(before);
      repository.verify.mockResolvedValue(after);

      const result = await service.verify(documentId);

      expect(result).toEqual(after);

      expect(repository.findById).toHaveBeenCalledWith(
        documentId,
      );

      expect(repository.verify).toHaveBeenCalledWith(
        documentId,
      );

      expect(auditService.create).toHaveBeenCalledWith({
        caseId,
        action: CaseAuditAction.DOCUMENT_VERIFIED,
        documentId,
        description: 'Case document verified',
        metadata: {
          previousStatus: before.status,
          newStatus: after.status,
          verifiedAt,
        },
      });
    });
  });

  describe('reject', () => {
    it('should reject the document and audit DOCUMENT_REJECTED', async () => {
      const before = {
        ...requiredDocument,
        status: 'UPLOADED',
        filePath: 'uploads/test-document.pdf',
      };

      const after = {
        ...before,
        status: 'REJECTED',
        rejectionReason:
          'Invalid ownership document',
      };

      repository.findById.mockResolvedValue(before);
      repository.reject.mockResolvedValue(after);

      const rejectionReason =
        'Invalid ownership document';

      const result = await service.reject(
        documentId,
        rejectionReason,
      );

      expect(result).toEqual(after);

      expect(repository.findById).toHaveBeenCalledWith(
        documentId,
      );

      expect(repository.reject).toHaveBeenCalledWith(
        documentId,
        rejectionReason,
      );

      expect(auditService.create).toHaveBeenCalledWith({
        caseId,
        action: CaseAuditAction.DOCUMENT_REJECTED,
        documentId,
        description: 'Case document rejected',
        metadata: {
          previousStatus: before.status,
          newStatus: after.status,
          rejectionReason: after.rejectionReason,
        },
      });
    });
  });

  describe('remove', () => {
    it('should remove the document and audit DOCUMENT_DELETED', async () => {
      repository.findById.mockResolvedValue(
        requiredDocument,
      );

      const deletedResult = {
        id: documentId,
      };

      repository.remove.mockResolvedValue(
        deletedResult,
      );

      const result =
        await service.remove(documentId);

      expect(result).toEqual(deletedResult);

      expect(repository.findById).toHaveBeenCalledWith(
        documentId,
      );

      expect(repository.remove).toHaveBeenCalledWith(
        documentId,
      );

      expect(auditService.create).toHaveBeenCalledWith({
        caseId,
        action: CaseAuditAction.DOCUMENT_DELETED,
        documentId,
        description: 'Case document deleted',
        metadata: {
          deleted: true,
          type: requiredDocument.type,
          title: requiredDocument.title,
          previousStatus: requiredDocument.status,
        },
      });
    });
  });
});