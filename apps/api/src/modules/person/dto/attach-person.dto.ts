import { IsDateString, IsOptional, IsString, Length, Matches } from 'class-validator';

export class AttachPersonDto {
  @IsString()
  @Length(3, 200)
  displayName!: string;

  @IsString()
  @Length(2, 100)
  firstName!: string;

  @IsString()
  @Length(2, 100)
  lastName!: string;

  @IsOptional()
  @IsString()
  fatherName?: string;

  @Matches(/^\d{10}$/)
  nationalCode!: string;

  @IsOptional()
  @IsDateString()
  birthDate?: string;
}