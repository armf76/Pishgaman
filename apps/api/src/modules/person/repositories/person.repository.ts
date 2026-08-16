import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../../common/prisma/prisma.service';
import { CreatePersonDto } from '../dto/create-person.dto';
import { AttachPersonDto } from '../dto/attach-person.dto';
import { UpdatePersonDto } from '../dto/update-person.dto';

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
          birthDate: dto.birthDate
            ? new Date(dto.birthDate)
            : undefined,
        },
      });

      return {
        party,
        person,
      };
    });
  }

  async attachToParty(
    partyId: string,
    dto: AttachPersonDto,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const party = await tx.party.findUnique({
        where: {
          id: partyId,
        },
      });

      if (!party) {
        throw new NotFoundException(
          'Party not found',
        );
      }

      if (party.partyType !== 'PERSON') {
        throw new ConflictException(
          'Only PERSON parties can be linked to a Person',
        );
      }

      const existingPerson = await tx.person.findUnique({
        where: {
          partyId,
        },
      });

      if (existingPerson) {
        throw new ConflictException(
          'This Party is already linked to a Person',
        );
      }

      const existingNationalCode =
        await tx.person.findUnique({
          where: {
            nationalCode: dto.nationalCode,
          },
        });

      if (existingNationalCode) {
        throw new ConflictException(
          'A Person with this nationalCode already exists',
        );
      }

      const person = await tx.person.create({
        data: {
          partyId,
          firstName: dto.firstName,
          lastName: dto.lastName,
          fatherName: dto.fatherName,
          nationalCode: dto.nationalCode,
          birthDate: dto.birthDate
            ? new Date(dto.birthDate)
            : undefined,
        },
      });

      const updatedParty = await tx.party.update({
        where: {
          id: partyId,
        },
        data: {
          displayName: dto.displayName,
          status: 'ACTIVE',
          deletedAt: null,
        },
      });

      return {
        party: updatedParty,
        person,
      };
    });
  }

  async findAll() {
    return this.prisma.person.findMany({
      where: {
        party: {
          status: 'ACTIVE',
          deletedAt: null,
        },
      },
      include: {
        party: true,
      },
      orderBy: {
        createdAt: 'desc',
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

  async update(
    id: string,
    dto: UpdatePersonDto,
  ) {
    const person = await this.prisma.person.update({
      where: {
        id,
      },
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        fatherName: dto.fatherName,
        nationalCode: dto.nationalCode,
        birthDate: dto.birthDate
          ? new Date(dto.birthDate)
          : undefined,
      },
    });

    let party = null;

    if (dto.displayName !== undefined) {
      party = await this.prisma.party.update({
        where: {
          id: person.partyId,
        },
        data: {
          displayName: dto.displayName,
        },
      });
    }

    return {
      party,
      person,
    };
  }

  async remove(id: string) {
    const person = await this.prisma.person.findUnique({
      where: {
        id,
      },
      select: {
        partyId: true,
      },
    });

    if (!person) {
      return null;
    }

    const party = await this.prisma.party.update({
      where: {
        id: person.partyId,
      },
      data: {
        status: 'INACTIVE',
        deletedAt: new Date(),
      },
    });

    return {
      success: true,
      party,
    };
  }
}