import {
  Body,
  Controller,
  Get,
  Patch,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { SystemService } from './system.service';
import { UpdateSystemDto } from './dto/system.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';

@Controller('system-setting')
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  @Patch('gallery')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseInterceptors(FilesInterceptor('images', 10))
  async uploadGallery(@UploadedFiles() files: Express.Multer.File[]) {
    const data = await this.systemService.uploadGalleryImages(files);
    return {
      success: true,
      message: 'Gallery images uploaded successfully',
      data,
    };
  }

  @Get()
  async getSystem() {
    const data = await this.systemService.getSystem();
    return {
      success: true,
      message: 'System settings retrieved successfully',
      data,
    };
  }

  @Get('delivery-charge')
  async getDeliveryCharge() {
    const deliveryCharge = await this.systemService.getDeliveryCharge();
    return {
      success: true,
      message: 'Delivery charge retrieved successfully',
      data: { deliveryCharge },
    };
  }

  @Patch()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  async updateSystem(@Body() updateSystemDto: UpdateSystemDto) {
    const data = await this.systemService.updateSystem(updateSystemDto);
    return {
      success: true,
      message: 'System settings updated successfully',
      data,
    };
  }
}
