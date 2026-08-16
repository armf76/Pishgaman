import { PartyType } from '@prisma/client';

import {
  IsEnum,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class CreateOrganizationDto {
  @IsEnum(PartyType)
  partyType: PartyType = PartyType.ORGANIZATION;

  @IsString()
  @Length(2, 200)
  displayName!: string;

  @IsString()
  @Length(2, 200)
  companyName!: string;

  @IsString()
  @Length(1, 100)
  registrationNumber!: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{11}$/)
  nationalId?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  economicCode?: string;
}