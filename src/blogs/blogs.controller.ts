import { 
    Controller, Get, Post, Patch, Delete, Body, Param, Query, 
    UseGuards, UseInterceptors, UploadedFile, ValidationPipe 
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlogDto, UpdateBlogDto, BlogQueryDto, CreateCategoryDto, CreateBulkCategoriesDto } from './dto/blog.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  // --- Public Endpoints ---

  @Get()
  async findAll(@Query() query: BlogQueryDto) {
    return this.blogsService.findAllBlogs(query);
  }

  @Get('categories')
  async findAllCategories() {
    return this.blogsService.findAllCategories();
  }

  @Get('spotlight')
  async findSpotlight() {
    return this.blogsService.findAllBlogs({ isSpotlight: true });
  }

  @Get(':slug')
  async findOne(@Param('slug') slug: string) {
    return this.blogsService.findBlogBySlug(slug);
  }

  // --- Admin Endpoints ---

  @Post('create-blog')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body(new ValidationPipe({ transform: true })) dto: CreateBlogDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.blogsService.createBlog(dto, file);
  }

  @Post('categories')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  async createCategory(@Body() dto: CreateCategoryDto | CreateBulkCategoriesDto) {
    if ('names' in dto) {
      return this.blogsService.createBulkCategories(dto);
    }
    return this.blogsService.createCategory(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ transform: true })) dto: UpdateBlogDto,
    @UploadedFile() file?: Express.Multer.File
  ) {
    return this.blogsService.updateBlog(id, dto, file);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  async remove(@Param('id') id: string) {
    return this.blogsService.deleteBlog(id);
  }
}
