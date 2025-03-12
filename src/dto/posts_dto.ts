import { IsString, IsNotEmpty, IsArray, IsOptional } from 'class-validator';

export class PostDto {
  time(time: any) {
      throw new Error('Method not implemented.');
  }
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsArray()
  @IsString({ each: true })
  urls: string[];

  @IsNotEmpty()
  @IsString()
  date: string;

  @IsNotEmpty()
  @IsString()
  temps: string;

  @IsNotEmpty()
  @IsString()
  user_id: string;

  @IsArray()
  @IsString({ each: true })
  joints_urls: string[];
}
