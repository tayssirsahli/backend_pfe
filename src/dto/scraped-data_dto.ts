import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class ScrapedDataDto {
  @IsNotEmpty()
  @IsString()
  author: string;

  @IsNotEmpty()
  @IsString()
  selected_text: string;

  @IsNotEmpty()
  @IsString()
  image_url: string;

  @IsOptional()
  @IsString()
  comments?: string;

  @IsNotEmpty()
  @IsString()
  hashtags: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  platform: string;

  @IsOptional()
  id_user?: number;  // ID de l'utilisateur authentifié, optionnel lors de la création
}
