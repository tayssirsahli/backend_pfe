import { IsEmail, IsString, IsPhoneNumber, IsUrl, IsOptional } from 'class-validator';

export class UserDto {
  
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  username: string;

  phone: string;

  @IsString()
  location: string;

  avatar_url: string;

  @IsOptional()
  @IsString()
  newPassword?: string;  // Optionnel pour la mise à jour du profil
}
function au(): (target: UserDto, propertyKey: "id") => void {
  throw new Error('Function not implemented.');
}

