import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { PersonService } from '../services/person.service';
import { AttachPersonDto } from '../dto/attach-person.dto';
import { CreatePersonDto } from '../dto/create-person.dto';
import { UpdatePersonDto } from '../dto/update-person.dto';

@Controller('persons')
export class PersonController {
  constructor(
    private readonly service: PersonService,
  ) {}

  @Post()
  create(@Body() dto: CreatePersonDto) {
    return this.service.create(dto);
  }

  @Post('attach/:partyId')
  attachToParty(
    @Param('partyId') partyId: string,
    @Body() dto: AttachPersonDto,
  ) {
    return this.service.attachToParty(
      partyId,
      dto,
    );
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
    @Body() dto: UpdatePersonDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}