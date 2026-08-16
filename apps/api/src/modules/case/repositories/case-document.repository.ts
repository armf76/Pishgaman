import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  CaseDocumentStatus,
} from '@prisma/client';

import { PrismaService } from '../../../common/prisma/prisma.service';

import { CreateCaseDocumentDto } from '../dto/create-case-document.dto';
import { UpdateCaseDocumentDto } from '../dto/update-case-document.dto';

@Injectable()
export class CaseDocumentRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(
    caseId: string,
    dto: CreateCaseDocumentDto,
  ) {
    const existingDocument =
      await this.prisma.caseDocument.findUnique({
        where: {
          caseId_type: {
            caseId,
            type: dto.type,
          },
        },
      });

    if (existingDocument) {
      throw new ConflictException(
        `Document of type ${dto.type} already exists for this case.`,
      );
    }

    return this.prisma.caseDocument.create({
      data: {
        caseId,
        type: dto.type,
        title: dto.title,
        status:
          dto.status ?? CaseDocumentStatus.REQUIRED,
        filePath: dto.filePath,
      },
    });
  }

  async findAllByCaseId(caseId: string) {
    return this.prisma.caseDocument.findMany({
      where: {
        caseId,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async findById(id: string) {
    const document =
      await this.prisma.caseDocument.findUnique({
        where: {
          id,
        },
      });

    if (!document) {
      throw new NotFoundException(
        `Case document ${id} not found`,
      );
    }

    return document;
  }

  async update(
    id: string,
    dto: UpdateCaseDocumentDto,
  ) {
    const document = await this.findById(id);

    if (
      dto.type !== undefined &&
      dto.type !== document.type
    ) {
      const duplicate =
        await this.prisma.caseDocument.findUnique({
          where: {
            caseId_type: {
              caseId: document.caseId,
              type: dto.type,
            },
          },
        });

      if (duplicate) {
        throw new ConflictException(
          `Document of type ${dto.type} already exists for this case.`,
        );
      }
    }

    return this.prisma.caseDocument.update({
      where: {
        id,
      },
      data: {
        ...(dto.type !== undefined && {
          type: dto.type,
        }),
        ...(dto.title !== undefined && {
          title: dto.title,
        }),
        ...(dto.status !== undefined && {
          status: dto.status,
        }),
        ...(dto.filePath !== undefined && {
          filePath: dto.filePath,
        }),
        ...(dto.rejectionReason !== undefined && {
          rejectionReason: dto.rejectionReason,
        }),
      },
    });
  }

  async upload(
    id: string,
    filePath: string,
  ) {
    const document = await this.findById(id);

    if (
      document.status ===
      CaseDocumentStatus.VERIFIED
    ) {
      throw new BadRequestException(
        'Verified document cannot be uploaded again.',
      );
    }

    if (!filePath?.trim()) {
      throw new BadRequestException(
        'filePath is required.',
      );
    }

    return this.prisma.caseDocument.update({
      where: {
        id,
      },
      data: {
        filePath: filePath.trim(),
        status: CaseDocumentStatus.UPLOADED,
        uploadedAt: new Date(),
        rejectionReason: null,
        verifiedAt: null,
      },
    });
  }

  async verify(id: string) {
    const document = await this.findById(id);

    if (!document.filePath) {
      throw new BadRequestException(
        'Document must be uploaded before verification.',
      );
    }

    if (
      document.status !==
      CaseDocumentStatus.UPLOADED
    ) {
      throw new BadRequestException(
        `Document cannot be verified from status ${document.status}.`,
      );
    }

    return this.prisma.caseDocument.update({
      where: {
        id,
      },
      data: {
        status: CaseDocumentStatus.VERIFIED,
        verifiedAt: new Date(),
        rejectionReason: null,
      },
    });
  }

  async reject(
    id: string,
    rejectionReason: string,
  ) {
    const document = await this.findById(id);

    if (
      document.status !==
      CaseDocumentStatus.UPLOADED
    ) {
      throw new BadRequestException(
        `Document cannot be rejected from status ${document.status}.`,
      );
    }

    if (!rejectionReason?.trim()) {
      throw new BadRequestException(
        'rejectionReason is required.',
      );
    }

    return this.prisma.caseDocument.update({
      where: {
        id,
      },
      data: {
        status: CaseDocumentStatus.REJECTED,
        rejectionReason: rejectionReason.trim(),
        verifiedAt: null,
      },
    });
  }

  async remove(id: string) {
    await this.findById(id);

    return this.prisma.caseDocument.delete({
      where: {
        id,
      },
    });
  }
}