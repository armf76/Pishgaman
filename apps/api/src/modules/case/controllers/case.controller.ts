import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { CaseService } from '../services/case.service';
import { CreateCaseDto } from '../dto/create-case.dto';
import { UpdateCaseDto } from '../dto/update-case.dto';

@Controller('cases')
export class CaseController {
  constructor(
    private readonly service: CaseService,
  ) {}

  @Post()
  create(@Body() dto: CreateCaseDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCaseDto,
  ) {
    return this.service.update(id, dto);
  }

  @Post(':id/submit')
  submit(@Param('id') id: string) {
    return this.service.submit(id);
  }

  @Post(':id/review')
  startReview(@Param('id') id: string) {
    return this.service.startReview(id);
  }

  @Post(':id/request-documents')
  requestDocuments(@Param('id') id: string) {
    return this.service.requestDocuments(id);
  }

  @Post(':id/resubmit')
  resubmitForReview(@Param('id') id: string) {
    return this.service.resubmitForReview(id);
  }

  @Post(':id/approve')
  approve(@Param('id') id: string) {
    return this.service.approve(id);
  }

  @Post(':id/reject')
  reject(@Param('id') id: string) {
    return this.service.reject(id);
  }

  @Post(':id/complete')
  complete(@Param('id') id: string) {
    return this.service.complete(id);
  }

  @Post(':id/cancel')
  cancel(@Param('id') id: string) {
    return this.service.cancel(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}