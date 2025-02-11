import { IsInt, IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateDataDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    author: string;

    @IsString()
    @MaxLength(200)
    selected_text: string;

    @IsString()
    image_url: string;

    @IsString()
    comments: string;

    @IsInt()
    id_user: number;
}

export class UpdateDataDto {
    @IsString()
    @MaxLength(50)
    author?: string;

    @IsString()
    @MaxLength(200)
    selected_text?: string;

    @IsString()
    image_url?: string;

    @IsString()
    comments?: string;
}
