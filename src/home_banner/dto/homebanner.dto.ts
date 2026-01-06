import { IsNotEmpty } from "class-validator";

export class HomeBannerDto {

    @IsNotEmpty()
    label: string;

    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    description: string;

    @IsNotEmpty()
    image: string;
}