import { Injectable } from '@nestjs/common';

import { CreateOrganizationDto } from '../dto/create-organization.dto';
import { UpdateOrganizationDto } from '../dto/update-organization.dto';
import { OrganizationRepository } from '../repositories/organization.repository';

@Injectable()
export class OrganizationService {
  constructor(
    private readonly repository: OrganizationRepository,
  ) {}

  create(dto: CreateOrganizationDto) {
    return this.repository.create(dto);
  }

  findAll() {
    return this.repository.findAll();
  }

  findOne(id: string) {
    return this.repository.findById(id);
  }

  update(id: string, dto: UpdateOrganizationDto) {
    return this.repository.update(id, dto);
  }

  remove(id: string) {
    return this.repository.remove(id);
  }
}