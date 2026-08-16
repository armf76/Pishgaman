import { Module } from '@nestjs/common';

import { PrismaModule } from './common/prisma/prisma.module';

import { ApplicantModule } from './modules/applicant/applicant.module';
import { CaseModule } from './modules/case/case.module';
import { OrganizationModule } from './modules/organization/organization.module';
import { PartyModule } from './modules/party/party.module';
import { PersonModule } from './modules/person/person.module';

@Module({
  imports: [
    PrismaModule,
    PartyModule,
    PersonModule,
    OrganizationModule,
    ApplicantModule,
    CaseModule,
  ],
})
export class AppModule {}