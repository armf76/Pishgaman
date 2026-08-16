import { Module } from '@nestjs/common';

import { PrismaModule } from '../../common/prisma/prisma.module';

import { CaseController } from './controllers/case.controller';
import { CaseDocumentController } from './controllers/case-document.controller';
import { CaseAuditController } from './controllers/case-audit.controller';

import { CaseRepository } from './repositories/case.repository';
import { CaseDocumentRepository } from './repositories/case-document.repository';
import { CaseAuditRepository } from './repositories/case-audit.repository';

import { CaseService } from './services/case.service';
import { CaseDocumentService } from './services/case-document.service';
import { CaseAuditService } from './services/case-audit.service';

@Module({
  imports: [PrismaModule],

  controllers: [
    CaseController,
    CaseDocumentController,
    CaseAuditController,
  ],

  providers: [
    CaseRepository,
    CaseDocumentRepository,
    CaseAuditRepository,

    CaseService,
    CaseDocumentService,
    CaseAuditService,
  ],

  exports: [
    CaseService,
    CaseDocumentService,
    CaseAuditService,
  ],
})
export class CaseModule {}