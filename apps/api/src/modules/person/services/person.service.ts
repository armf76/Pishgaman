import { Injectable } from '@nestjs/common';

import { PersonRepository } from '../repositories/person.repository';
import { AttachPersonDto } from '../dto/attach-person.dto';
import { CreatePersonDto } from '../dto/create-person.dto';
import { UpdatePersonDto } from '../dto/update-person.dto';

@Injectable()
export class PersonService {
  constructor(
    private readonly repository: PersonRepository,
  ) {}

  create(dto: CreatePersonDto) {
    return this.repository.create(dto);
  }

  attachToParty(
    partyId: string,
    dto: AttachPersonDto,
  ) {
    return this.repository.attachToParty(
      partyId,
      dto,
    );
  }

  findAll() {
    return this.repository.findAll();
  }

  findOne(id: string) {
    return this.repository.findById(id);
  }

  update(
    id: string,
    dto: UpdatePersonDto,
  ) {
    return this.repository.update(id, dto);
  }

  remove(id: string) {
    return this.repository.remove(id);
  }
}