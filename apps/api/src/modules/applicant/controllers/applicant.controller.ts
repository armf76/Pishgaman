import {
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';

import { ApplicantService } from '../services/applicant.service';

@Controller('applicants')
export class ApplicantController {
  constructor(
    private readonly service: ApplicantService,
  ) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post(':id/activate')
  makeApplicant(@Param('id') id: string) {
    return this.service.makeApplicant(id);
  }
}