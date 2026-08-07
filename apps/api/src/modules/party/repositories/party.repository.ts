import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { CreatePartyDto } from '../dto/create-party.dto';
import { UpdatePartyDto } from '../dto/update-party.dto';

@Injectable()
export class PartyRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  create(dto: CreatePartyDto) {
    return this.prisma.party.create({
      data: {
        partyType: dto.partyType,
        displayName: dto.displayName,
      },
    });
  }

  findAll() {
    return this.prisma.party.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  findById(id: string) {
    return this.prisma.party.findUnique({
      where: {
        id,
      },
    });
  }

  update(id: string, dto: UpdatePartyDto) {
    return this.prisma.party.update({
      where: {
        id,
      },
      data: {
        displayName: dto.displayName,
        partyType: dto.partyType,
      },
    });
  }

  softDelete(id: string) {
    return this.prisma.party.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
        status: 'DELETED',
      },
    });
  }

  search(keyword: string) {
    return this.prisma.party.findMany({
      where: {
        deletedAt: null,
        displayName: {
          contains: keyword,
          mode: 'insensitive',
        },
      },
    });
  }
}