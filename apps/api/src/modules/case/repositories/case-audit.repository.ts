import { Injectable } from '@nestjs/common';

import {
  CaseAuditAction,
  CaseStatus,
  Prisma,
} from '@prisma/client';

import { PrismaService } from '../../../common/prisma/prisma.service';

@Injectable()
export class CaseAuditRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(params: {
    caseId: string;
    action: CaseAuditAction;
    fromStatus?: CaseStatus;
    toStatus?: CaseStatus;
    documentId?: string;
    description?: string;
    metadata?: Record<string, unknown>;
  }) {
    return this.prisma.caseAudit.create({
      data: {
        caseId: params.caseId,
        action: params.action,
        fromStatus: params.fromStatus,
        toStatus: params.toStatus,
        documentId: params.documentId,
        description: params.description,
        metadata:
          params.metadata !== undefined
            ? (params.metadata as Prisma.InputJsonValue)
            : undefined,
      },
    });
  }

  async findAllByCaseId(caseId: string) {
    return this.prisma.caseAudit.findMany({
      where: {
        caseId,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async findById(id: string) {
    return this.prisma.caseAudit.findUnique({
      where: {
        id,
      },
    });
  }
}