import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../common/prisma/prisma.service';
import { CreateOrganizationDto } from '../dto/create-organization.dto';
import { UpdateOrganizationDto } from '../dto/update-organization.dto';

@Injectable()
export class OrganizationRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(dto: CreateOrganizationDto) {
    return this.prisma.$transaction(async (tx) => {
      const party = await tx.party.create({
        data: {
          partyType: dto.partyType,
          displayName: dto.displayName,
        },
      });

      const organization = await tx.organization.create({
        data: {
          partyId: party.id,
          companyName: dto.companyName,
          registrationNumber: dto.registrationNumber,
          nationalId: dto.nationalId,
          economicCode: dto.economicCode,
        },
      });

      return {
        party,
        organization,
      };
    });
  }

  async findAll() {
    return this.prisma.organization.findMany({
      where: {
        party: {
          status: 'ACTIVE',
          deletedAt: null,
        },
      },
      include: {
        party: true,
      },
    });
  }

  async findById(id: string) {
    return this.prisma.organization.findUnique({
      where: {
        id,
      },
      include: {
        party: true,
      },
    });
  }

  async update(id: string, dto: UpdateOrganizationDto) {
    return this.prisma.$transaction(async (tx) => {
      const organization = await tx.organization.update({
        where: {
          id,
        },
        data: {
          companyName: dto.companyName,
          registrationNumber: dto.registrationNumber,
          nationalId: dto.nationalId,
          economicCode: dto.economicCode,
        },
      });

      let party = null;

      if (dto.displayName !== undefined) {
        party = await tx.party.update({
          where: {
            id: organization.partyId,
          },
          data: {
            displayName: dto.displayName,
          },
        });
      }

      return {
        party,
        organization,
      };
    });
  }

  async remove(id: string) {
    return this.prisma.$transaction(async (tx) => {
      const organization = await tx.organization.findUnique({
        where: {
          id,
        },
      });

      if (!organization) {
        return null;
      }

      const party = await tx.party.update({
        where: {
          id: organization.partyId,
        },
        data: {
          status: 'INACTIVE',
          deletedAt: new Date(),
        },
      });

      return {
        success: true,
        party,
        organization,
      };
    });
  }
}