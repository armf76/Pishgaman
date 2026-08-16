import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../common/prisma/prisma.service';

@Injectable()
export class ApplicantRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async findAll() {
    return this.prisma.party.findMany({
      where: {
        status: 'ACTIVE',
        deletedAt: null,
        roles: {
          some: {
            role: 'APPLICANT',
            active: true,
          },
        },
      },
      include: {
        person: true,
        organization: true,
        contacts: true,
        addresses: true,
        roles: true,
        documents: true,
        bankAccounts: true,
        cases: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findById(id: string) {
    return this.prisma.party.findFirst({
      where: {
        id,
        status: 'ACTIVE',
        deletedAt: null,
        roles: {
          some: {
            role: 'APPLICANT',
            active: true,
          },
        },
      },
      include: {
        person: true,
        organization: true,
        contacts: true,
        addresses: true,
        roles: true,
        documents: true,
        bankAccounts: true,
        cases: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
  }

  async findPartyById(id: string) {
    return this.prisma.party.findFirst({
      where: {
        id,
        status: 'ACTIVE',
        deletedAt: null,
      },
      include: {
        roles: true,
        person: true,
        organization: true,
      },
    });
  }

  async addApplicantRole(partyId: string) {
    return this.prisma.partyRole.create({
      data: {
        partyId,
        role: 'APPLICANT',
        active: true,
      },
    });
  }
}