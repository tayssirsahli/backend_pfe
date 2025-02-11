import { IsString, IsEmail, MinLength } from 'class-validator';

export class UserUpDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

 
}


export class UserInDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}