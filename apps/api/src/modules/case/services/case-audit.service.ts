import { Injectable } from '@nestjs/common';

import {
  CaseAuditAction,
  CaseStatus,
} from '@prisma/client';

import { CaseAuditRepository } from '../repositories/case-audit.repository';

@Injectable()
export class CaseAuditService {
  constructor(
    private readonly repository: CaseAuditRepository,
  ) {}

  create(params: {
    caseId: string;
    action: CaseAuditAction;
    fromStatus?: CaseStatus;
    toStatus?: CaseStatus;
    documentId?: string;
    description?: string;
    metadata?: Record<string, unknown>;
  }) {
    return this.repository.create(params);
  }

  findAllByCaseId(caseId: string) {
    return this.repository.findAllByCaseId(caseId);
  }

  findById(id: string) {
    return this.repository.findById(id);
  }
}