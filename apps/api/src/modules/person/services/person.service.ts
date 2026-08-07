import { Injectable } from '@nestjs/common';

import { PersonRepository } from '../repositories/person.repository';
import { CreatePersonDto } from '../dto/create-person.dto';

@Injectable()
export class PersonService {
  constructor(
    private readonly repository: PersonRepository,
  ) {}

  create(dto: CreatePersonDto) {
    return this.repository.create(dto);
  }

  findAll() {
    return this.repository.findAll();
  }

  findOne(id: string) {
    return this.repository.findById(id);
  }

  update(id: string) {
    return this.repository.findById(id);
  }
}