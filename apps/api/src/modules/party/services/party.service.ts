import { Injectable } from '@nestjs/common';

import { PartyRepository } from '../repositories/party.repository';
import { CreatePartyDto } from '../dto/create-party.dto';
import { UpdatePartyDto } from '../dto/update-party.dto';

@Injectable()
export class PartyService {
  constructor(
    private readonly repository: PartyRepository,
  ) {}

  create(dto: CreatePartyDto) {
    return this.repository.create(dto);
  }

  findAll() {
    return this.repository.findAll();
  }

  findOne(id: string) {
    return this.repository.findById(id);
  }

  update(id: string, dto: UpdatePartyDto) {
    return this.repository.update(id, dto);
  }

  remove(id: string) {
    return this.repository.softDelete(id);
  }

  search(keyword: string) {
    return this.repository.search(keyword);
  }
}