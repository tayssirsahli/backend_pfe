import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class GeneratedIdeaDto {
  @IsNotEmpty()
  @IsString()
  user_id: string;

  @IsNotEmpty()
  @IsString()
  generated_text: string;

  @IsOptional()
  @IsString()
  media_url?: string;  // Si tu veux inclure un media dans l'idée générée
}
