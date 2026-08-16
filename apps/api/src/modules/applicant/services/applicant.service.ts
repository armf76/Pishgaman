import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { ApplicantRepository } from '../repositories/applicant.repository';

@Injectable()
export class ApplicantService {
  constructor(
    private readonly repository: ApplicantRepository,
  ) {}

  findAll() {
    return this.repository.findAll();
  }

  findOne(id: string) {
    return this.repository.findById(id);
  }

  async makeApplicant(partyId: string) {
    const party = await this.repository.findPartyById(partyId);

    if (!party) {
      throw new NotFoundException(
        'Party not found or is not active',
      );
    }

    const existingRole = party.roles.find(
      (item) =>
        item.role === 'APPLICANT' &&
        item.active === true,
    );

    if (existingRole) {
      throw new BadRequestException(
        'This party is already an applicant',
      );
    }

    return this.repository.addApplicantRole(partyId);
  }
}