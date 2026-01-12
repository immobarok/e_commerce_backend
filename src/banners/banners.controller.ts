import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { BannersService } from './banners.service';
import { BannerDto } from './dto/banner.dto';
import { Banner } from './schemas/banner.schema';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/schemas/user.schema';

@Controller('banners')
export class BannersController {
    constructor(
        private readonly bannersService: BannersService,
        private readonly cloudinaryService: CloudinaryService
    ) { }

    @Post("create-banner")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @UseInterceptors(FileInterceptor('file'))
    async createBanner(@Body() bannerDto: BannerDto, @UploadedFile() file: Express.Multer.File): Promise<Banner | null> {
        if (file) {
            const imageUrl = await this.cloudinaryService.uploadImage(file, 'banners');
            bannerDto.image = imageUrl;
        }
        return this.bannersService.createBanner(bannerDto);
    }

    @Post("create-multiple-banners")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @UseInterceptors(FilesInterceptor('files'))
    async createMultipleBanners(@Body('banners') bannersString: string, @UploadedFiles() files: Array<Express.Multer.File>): Promise<Banner[]> {
        const bannersDto: BannerDto[] = JSON.parse(bannersString);

        if (files && files.length > 0) {
            // Upload all images in parallel
            const uploadPromises = files.map(file => this.cloudinaryService.uploadImage(file, 'banners'));
            const imageUrls = await Promise.all(uploadPromises);

            // Assign images to banners. Assuming 1-to-1 order match if files are provided.
            // If files count < banners count, we populate as many as we have.
            // A more robust way would be to have an ID reference, but for now we follow simple index matching.
            files.forEach((file, index) => {
                if (bannersDto[index]) {
                    bannersDto[index].image = imageUrls[index];
                }
            });
        }
        return this.bannersService.createMultipleBanners(bannersDto);
    }

    @Get("get-all-banners")
    async findAll(): Promise<Banner[] | null> {
        return this.bannersService.findAll();
    }

    @Get("get-banner/:slug")
    async findOne(@Param('slug') slug: string): Promise<Banner | null> {
        return this.bannersService.findOne(slug);
    }

    @Delete("delete-banner/:id")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async remove(@Param('id') id: string): Promise<Banner | null> {
        return this.bannersService.remove(id);
    }

    @Put("update-banner/:id")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @UseInterceptors(FileInterceptor('file'))
    async update(@Param('id') id: string, @Body() bannerDto: BannerDto, @UploadedFile() file: Express.Multer.File): Promise<Banner | null> {
        if (file) {
            const imageUrl = await this.cloudinaryService.uploadImage(file, 'banners');
            bannerDto.image = imageUrl;
        }
        return this.bannersService.update(id, bannerDto);
    }
}
