import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateContactDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  message: string;
}

export class ContactInformationDto {
  @IsArray()
  @IsEmail({}, { each: true })
  @IsOptional()
  email?: string[];

  @IsString()
  phoneNumber?: string;

  @IsString()
  address?: string;

  @IsString()
  businessHours?: string;
}