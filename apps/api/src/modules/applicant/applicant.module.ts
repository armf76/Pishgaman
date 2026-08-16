import { Module } from '@nestjs/common';

import { PrismaModule } from '../../common/prisma/prisma.module';

import { ApplicantController } from './controllers/applicant.controller';
import { ApplicantRepository } from './repositories/applicant.repository';
import { ApplicantService } from './services/applicant.service';

@Module({
  imports: [PrismaModule],
  controllers: [ApplicantController],
  providers: [
    ApplicantRepository,
    ApplicantService,
  ],
  exports: [
    ApplicantService,
  ],
})
export class ApplicantModule {}