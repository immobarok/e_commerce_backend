import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { BannersService } from './banners.service';
import { BannerDto } from './dto/banner.dto';
import { Banner } from './schemas/banner.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Controller('banners')
export class BannersController {
    constructor(
        private readonly bannersService: BannersService,
        private readonly cloudinaryService: CloudinaryService
    ) { }

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async createBanner(@Body() bannerDto: BannerDto, @UploadedFile() file: Express.Multer.File): Promise<Banner | null> {
        if (file) {
            const imageUrl = await this.cloudinaryService.uploadImage(file, 'banners');
            bannerDto.image = imageUrl;
        }
        return this.bannersService.createBanner(bannerDto);
    }

    @Get()
    async findAll(): Promise<Banner[] | null> {
        return this.bannersService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Banner | null> {
        return this.bannersService.findOne(id);
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<Banner | null> {
        return this.bannersService.remove(id);
    }

    @Put(':id')
    @UseInterceptors(FileInterceptor('file'))
    async update(@Param('id') id: string, @Body() bannerDto: BannerDto, @UploadedFile() file: Express.Multer.File): Promise<Banner | null> {
        if (file) {
            const imageUrl = await this.cloudinaryService.uploadImage(file, 'banners');
            bannerDto.image = imageUrl;
        }
        return this.bannersService.update(id, bannerDto);
    }
}
