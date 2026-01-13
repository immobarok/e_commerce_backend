import { IsString, IsOptional } from 'class-validator';

export class UpdateBannerDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    label?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    slug?: string;

    @IsString()
    @IsOptional()
    timeToRead?: string;

    @IsOptional()
    postedDate?: Date;
}
