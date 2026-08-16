import { Module } from '@nestjs/common';

import { PrismaModule } from '../../common/prisma/prisma.module';

import { OrganizationController } from './controllers/organization.controller';
import { OrganizationRepository } from './repositories/organization.repository';
import { OrganizationService } from './services/organization.service';

@Module({
  imports: [PrismaModule],
  controllers: [OrganizationController],
  providers: [OrganizationRepository, OrganizationService],
  exports: [OrganizationService],
})
export class OrganizationModule {}