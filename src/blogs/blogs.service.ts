import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog } from './schemas/blog.schema';
import { BlogCategory } from './schemas/category.schema';
import { CreateBlogDto, UpdateBlogDto, BlogQueryDto, CreateCategoryDto, CreateBulkCategoriesDto } from './dto/blog.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class BlogsService {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<Blog>,
    @InjectModel(BlogCategory.name) private categoryModel: Model<BlogCategory>,
    private cloudinaryService: CloudinaryService,
  ) {}

  // --- Category Management ---

  async createCategory(dto: CreateCategoryDto): Promise<BlogCategory> {
    const slug = dto.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    const existing = await this.categoryModel.findOne({ slug });
    if (existing) throw new ConflictException(`Category "${dto.name}" already exists`);
    
    const category = new this.categoryModel({ ...dto, slug });
    return category.save();
  }

  async createBulkCategories(dto: CreateBulkCategoriesDto): Promise<BlogCategory[]> {
    const createdCategories: BlogCategory[] = [];
    
    for (const name of dto.names) {
      const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
      const existing = await this.categoryModel.findOne({ slug });
      
      if (!existing) {
        const category = new this.categoryModel({ name, slug });
        createdCategories.push(await category.save());
      }
    }
    
    return createdCategories;
  }

  async findAllCategories(): Promise<BlogCategory[]> {
    return this.categoryModel.find().sort({ name: 1 }).exec();
  }

  async findCategoryById(id: string): Promise<BlogCategory> {
    const category = await this.categoryModel.findById(id).exec();
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  // --- Blog Management ---

  async createBlog(dto: CreateBlogDto, file: Express.Multer.File): Promise<Blog> {
    await this.findCategoryById(dto.category);
    
    const slug = dto.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + '-' + Date.now();
    const imageUrl = await this.cloudinaryService.uploadImage(file, 'blogs');

    const blog = new this.blogModel({
      ...dto,
      slug,
      image: imageUrl,
    });

    return blog.save();
  }

  async findAllBlogs(query: BlogQueryDto): Promise<Blog[]> {
    const filter: any = {};
    
    if (query.category) {
      const category = await this.categoryModel.findOne({ 
        $or: [{ _id: query.category }, { slug: query.category }] 
      });
      if (category) filter.category = category._id;
    }

    if (query.isSpotlight !== undefined) {
      filter.isSpotlight = query.isSpotlight;
    }

    if (query.search) {
      filter.$or = [
        { title: { $regex: query.search, $options: 'i' } },
        { label: { $regex: query.search, $options: 'i' } },
      ];
    }

    return this.blogModel.find(filter).populate('category').sort({ postedDate: -1 }).exec();
  }

  async findBlogBySlug(slug: string): Promise<Blog> {
    const blog = await this.blogModel.findOne({ slug }).populate('category').exec();
    if (!blog) throw new NotFoundException('Blog not found');
    return blog;
  }

  async updateBlog(id: string, dto: UpdateBlogDto, file?: Express.Multer.File): Promise<Blog> {
    const blog = await this.blogModel.findById(id);
    if (!blog) throw new NotFoundException('Blog not found');

    const updateData: any = { ...dto };

    if (dto.category) await this.findCategoryById(dto.category);
    
    if (file) {
      // Delete old image from cloudinary if possible
      try {
        await this.cloudinaryService.deleteImage(blog.image);
      } catch (e) {
        console.error('Failed to delete old image from Cloudinary', e);
      }
      updateData.image = await this.cloudinaryService.uploadImage(file, 'blogs');
    }

    if (dto.title) {
        updateData.slug = dto.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + '-' + Date.now();
    }

    const updatedBlog = await this.blogModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    if (!updatedBlog) throw new NotFoundException('Blog not found');
    return updatedBlog;
  }

  async deleteBlog(id: string): Promise<void> {
    const blog = await this.blogModel.findById(id);
    if (!blog) throw new NotFoundException('Blog not found');

    try {
      await this.cloudinaryService.deleteImage(blog.image);
    } catch (e) {
       console.error('Failed to delete image from Cloudinary', e);
    }

    await this.blogModel.findByIdAndDelete(id).exec();
  }
}
