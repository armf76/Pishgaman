import { Module } from '@nestjs/common';

import { PrismaModule } from '../../common/prisma/prisma.module';

import { PersonController } from './controllers/person.controller';
import { PersonService } from './services/person.service';
import { PersonRepository } from './repositories/person.repository';

@Module({
  imports: [PrismaModule],
  controllers: [PersonController],
  providers: [
    PersonRepository,
    PersonService,
  ],
  exports: [
    PersonService,
  ],
})
export class PersonModule {}