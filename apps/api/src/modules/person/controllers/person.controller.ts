import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { PersonService } from '../services/person.service';
import { CreatePersonDto } from '../dto/create-person.dto';

@Controller('persons')
export class PersonController {
  constructor(
    private readonly service: PersonService,
  ) {}

  @Post()
  create(@Body() dto: CreatePersonDto) {
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
  update(@Param('id') id: string) {
    return this.service.update(id);
  }
}