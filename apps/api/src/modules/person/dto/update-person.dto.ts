import { IsDateString, IsOptional, IsString, Length, Matches } from 'class-validator';

export class UpdatePersonDto {
  @IsOptional()
  @IsString()
  @Length(3, 200)
  displayName?: string;

  @IsOptional()
  @IsString()
  @Length(2, 100)
  firstName?: string;

  @IsOptional()
  @IsString()
  @Length(2, 100)
  lastName?: string;

  @IsOptional()
  @IsString()
  fatherName?: string;

  @IsOptional()
  @Matches(/^\d{10}$/)
  nationalCode?: string;

  @IsOptional()
  @IsDateString()
  birthDate?: string;
}