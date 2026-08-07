import { IsEnum, IsString, Length } from 'class-validator';

import { PartyType } from '@prisma/client';

export class CreatePartyDto {
  @IsEnum(PartyType)
  partyType!: PartyType;

  @IsString()
  @Length(2, 200)
  displayName!: string;
}