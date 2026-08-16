import {
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class UpdateOrganizationDto {
  @IsOptional()
  @IsString()
  @Length(2, 200)
  displayName?: string;

  @IsOptional()
  @IsString()
  @Length(2, 200)
  companyName?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  registrationNumber?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{11}$/)
  nationalId?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  economicCode?: string;
}