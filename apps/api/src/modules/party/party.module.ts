import { Module } from '@nestjs/common';

import { PrismaModule } from '../../common/prisma/prisma.module';

import { PartyController } from './controllers/party.controller';
import { PartyService } from './services/party.service';
import { PartyRepository } from './repositories/party.repository';

@Module({
  imports: [PrismaModule],
  controllers: [PartyController],
  providers: [
    PartyRepository,
    PartyService,
  ],
  exports: [PartyService],
})
export class PartyModule {}