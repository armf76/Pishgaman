import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../common/prisma/prisma.service';

import { CreateCaseDto } from '../dto/create-case.dto';
import { UpdateCaseDto } from '../dto/update-case.dto';

@Injectable()
export class CaseRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(dto: CreateCaseDto) {
    const year = new Date().getFullYear() - 621;

    const count = await this.prisma.case.count();

    const caseNumber =
      `PGM-${year}-${String(count + 1).padStart(6, '0')}`;

    return this.prisma.case.create({
      data: {
        caseNumber,
        applicantPartyId: dto.applicantPartyId,
        title: dto.title,
        description: dto.description,
      },
      include: {
        applicant: true,
      },
    });
  }

  async findAll() {
    return this.prisma.case.findMany({
      include: {
        applicant: true,
        caseDocuments: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findById(id: string) {
    return this.prisma.case.findUnique({
      where: {
        id,
      },
      include: {
        applicant: true,
        caseDocuments: true,
      },
    });
  }

  async findDocumentsByCaseId(caseId: string) {
    return this.prisma.caseDocument.findMany({
      where: {
        caseId,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async update(
    id: string,
    dto: UpdateCaseDto,
  ) {
    return this.prisma.case.update({
      where: {
        id,
      },
      data: {
        title: dto.title,
        description: dto.description,
        ...(dto.status !== undefined
          ? { status: dto.status }
          : {}),
      },
      include: {
        applicant: true,
        caseDocuments: true,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.case.delete({
      where: {
        id,
      },
    });
  }
}