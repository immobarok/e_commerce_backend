import { Controller, Get, Post, Patch, Body, UsePipes, ValidationPipe, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { AboutService } from './about.service';
import { UpdateAboutPageDto, PartialUpdateAboutPageDto } from './dto/about.dto';

@Controller('about')
export class AboutController {
  constructor(private readonly aboutService: AboutService) {}

  @Get('get-about')
  async getAboutPage() {
    return this.aboutService.getAboutPage();
  }

  @Post('create-about')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'heroImage', maxCount: 1 },
    { name: 'contentImage', maxCount: 1 },
    { name: 'studioImages', maxCount: 10 },
  ]))
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async saveAboutPage(
    @Body() data: UpdateAboutPageDto,
    @UploadedFiles() files: { heroImage?: Express.Multer.File[], contentImage?: Express.Multer.File[], studioImages?: Express.Multer.File[] }
  ) {
    return this.aboutService.saveAboutPage(data, files);
  }

  @Patch('update-about')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'heroImage', maxCount: 1 },
    { name: 'contentImage', maxCount: 1 },
    { name: 'studioImages', maxCount: 10 },
  ]))
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async updateAboutPage(
    @Body() data: PartialUpdateAboutPageDto,
    @UploadedFiles() files: { heroImage?: Express.Multer.File[], contentImage?: Express.Multer.File[], studioImages?: Express.Multer.File[] }
  ) {
    return this.aboutService.partialUpdateAboutPage(data, files);
  }
}
