import { Controller, Get, Param } from '@nestjs/common';

import { CaseAuditService } from '../services/case-audit.service';

@Controller('cases')
export class CaseAuditController {
  constructor(
    private readonly auditService: CaseAuditService,
  ) {}

  @Get(':caseId/audit')
  findAllByCaseId(
    @Param('caseId') caseId: string,
  ) {
    return this.auditService.findAllByCaseId(caseId);
  }
}