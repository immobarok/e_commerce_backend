import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { HomeBannerService } from './home_banner.service';
import { HomeBannerDto } from './dto/homebanner.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';

@Controller('home-banner')
export class HomeBannerController {
  constructor(private readonly homeBannerService: HomeBannerService) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    const imageUrl = await this.homeBannerService.uploadBannerImage(file);
    return {
      success: true,
      message: 'Image uploaded successfully',
      data: { imageUrl },
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  async create(@Body() createHomeBannerDto: HomeBannerDto) {
    const data = await this.homeBannerService.createHomeBanner(createHomeBannerDto);
    return {
      success: true,
      message: 'Home banner created successfully',
      data,
    };
  }

  @Get()
  async findAll() {
    const data = await this.homeBannerService.findAll();
    return {
      success: true,
      message: 'Home banners retrieved successfully',
      data,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.homeBannerService.findOne(id);
    return {
      success: true,
      message: 'Home banner retrieved successfully',
      data,
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  async update(@Param('id') id: string, @Body() updateHomeBannerDto: HomeBannerDto) {
    const data = await this.homeBannerService.update(id, updateHomeBannerDto);
    return {
      success: true,
      message: 'Home banner updated successfully',
      data,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  async delete(@Param('id') id: string) {
    const data = await this.homeBannerService.delete(id);
    return {
      success: true,
      message: 'Home banner deleted successfully',
      data,
    };
  }
}
