import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class BannerDto {
    @IsString()
    @IsNotEmpty()
    label:string;

    @IsString()
    @IsNotEmpty()
    title:string;

    @IsString()
    @IsNotEmpty()
    description:string;
    
    @IsString()
    @IsNotEmpty()
    image:string;
    
    @IsString()
    @IsOptional()
    link?:string;   
}

