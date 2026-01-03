export class LoginDto {
  email: string;
  password: string;
}

export class CreateAdminDto {
  email: string;
  password: string;
}

import { IsString, IsEmail, IsNotEmpty, MinLength, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  confirmPassword: string;

  @IsString()
  @IsOptional()
  displayProfile?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  bio?: string;
}

export class LoginResponseDto {
  access_token: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    role: string;
    displayProfile?: string;
    address?: string;
    phone?: string;
    bio?: string;
  };
}
