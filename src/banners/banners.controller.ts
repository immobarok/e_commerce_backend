import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { BannersService } from './banners.service';
import { BannerDto } from './dto/banner.dto';
import { Banner } from './schemas/banner.schema';

@Controller('banners')
export class BannersController {
    constructor(private readonly bannersService: BannersService) {
        this.bannersService = bannersService;
    }

    @Post()
    async createBanner(@Body() bannerDto: BannerDto): Promise<Banner | null> {
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
    async update(@Param('id') id: string, @Body() bannerDto: BannerDto): Promise<Banner | null> {
        return this.bannersService.update(id, bannerDto);
    }
}
