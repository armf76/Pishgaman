import { ApplicantModule } from './modules/applicant/applicant.module';
import { Module } from '@nestjs/common';

import { PrismaModule } from './common/prisma/prisma.module';

import { PartyModule } from './modules/party/party.module';
import { PersonModule } from './modules/person/person.module';
import { OrganizationModule } from './modules/organization/organization.module';

@Module({
  imports: [
    PrismaModule,
    PartyModule,
    PersonModule,
    OrganizationModule,
    ApplicantModule,
  ],
})
export class AppModule {}