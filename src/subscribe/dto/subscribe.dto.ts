import {
  IsString,
  IsNotEmpty,
  IsEmail,
} from 'class-validator';

export class SubscribeDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;
}
