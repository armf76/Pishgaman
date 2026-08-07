import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../common/prisma/prisma.service';
import { CreatePersonDto } from '../dto/create-person.dto';

@Injectable()
export class PersonRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(dto: CreatePersonDto) {
    return this.prisma.$transaction(async (tx) => {
      const party = await tx.party.create({
        data: {
          partyType: dto.partyType,
          displayName: dto.displayName,
        },
      });

      const person = await tx.person.create({
        data: {
          partyId: party.id,
          firstName: dto.firstName,
          lastName: dto.lastName,
          fatherName: dto.fatherName,
          nationalCode: dto.nationalCode,
          birthDate: dto.birthDate,
        },
      });

      return {
        party,
        person,
      };
    });
  }

  async findAll() {
    return this.prisma.person.findMany({
      include: {
        party: true,
      },
    });
  }

  async findById(id: string) {
    return this.prisma.person.findUnique({
      where: {
        id,
      },
      include: {
        party: true,
      },
    });
  }
}