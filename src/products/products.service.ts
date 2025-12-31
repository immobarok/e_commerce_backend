import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './schemas/product.schema';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { CloudinaryService } from './cloudinary.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    private cloudinaryService: CloudinaryService,
  ) {}

  private generateProductCode(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'MBRK-';
    for (let i = 0; i < 5; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
  }

  private async generateUniqueProductCode(): Promise<string> {
    let productCode = '';
    let isUnique = false;

    while (!isUnique) {
      productCode = this.generateProductCode();
      const existingProduct = await this.productModel.findOne({ productCode }).exec();
      if (!existingProduct) {
        isUnique = true;
      }
    }

    return productCode;
  }

  async create(
    createProductDto: CreateProductDto,
    files?: Express.Multer.File[],
  ): Promise<Product> {
    let imageUrls: string[] = [];

    if (files && files.length > 0) {
      imageUrls = await this.cloudinaryService.uploadMultipleImages(files);
    }

    const slug = createProductDto.productName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const productCode = await this.generateUniqueProductCode();

    const product = new this.productModel({
      ...createProductDto,
      slug,
      productCode,
      images: imageUrls,
    });

    return product.save();
  }

  async findAll(query?: any): Promise<{ products: Product[]; total: number }> {
    const filter: any = { isActive: true };

    if (query?.category) {
      filter.category = query.category;
    }

    if (query?.bestSelling === 'true') {
      filter.bestSelling = true;
    }

    if (query?.topRated === 'true') {
      filter.topRated = true;
    }

    if (query?.search) {
      filter.productName = { $regex: query.search, $options: 'i' };
    }

    if (query?.minPrice || query?.maxPrice) {
      filter.price = {};
      if (query.minPrice) filter.price.$gte = Number(query.minPrice);
      if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
    }

    const page = Number(query?.page) || 1;
    const limit = Number(query?.limit) || 10;
    const skip = (page - 1) * limit;

    const sort: any = {};
    if (query?.sortBy) {
      sort[query.sortBy] = query.sortOrder === 'desc' ? -1 : 1;
    } else {
      sort.createdAt = -1;
    }

    const [products, total] = await Promise.all([
      this.productModel.find(filter).sort(sort).skip(skip).limit(limit).exec(),
      this.productModel.countDocuments(filter),
    ]);

    return { products, total };
  }

  async findBySlug(slug: string): Promise<Product> {
    const product = await this.productModel.findOne({ slug, isActive: true }).exec();
    if (!product) {
      throw new NotFoundException(`Product with slug ${slug} not found`);
    }
    return product;
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    files?: Express.Multer.File[],
  ): Promise<Product> {
    const product = await this.findOne(id);

    let imageUrls: string[] = product.images;

    if (files && files.length > 0) {
      const newImageUrls =
        await this.cloudinaryService.uploadMultipleImages(files);
      imageUrls = [...imageUrls, ...newImageUrls];
    }

    let slug = product.slug;
    if (updateProductDto.productName) {
      slug = updateProductDto.productName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    const updatedProduct = await this.productModel
      .findByIdAndUpdate(
        id,
        { ...updateProductDto, slug, images: imageUrls },
        { new: true },
      )
      .exec();

    if (!updatedProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return updatedProduct;
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);

    // Delete images from Cloudinary
    if (product.images && product.images.length > 0) {
      await Promise.all(
        product.images.map((imageUrl) =>
          this.cloudinaryService.deleteImage(imageUrl),
        ),
      );
    }

    await this.productModel.findByIdAndDelete(id).exec();
  }

  async removeImage(productId: string, imageUrl: string): Promise<Product> {
    const product = await this.findOne(productId);

    if (!product.images.includes(imageUrl)) {
      throw new BadRequestException('Image not found in product');
    }

    // Delete from Cloudinary
    await this.cloudinaryService.deleteImage(imageUrl);

    // Remove from product
    product.images = product.images.filter((img) => img !== imageUrl);
    return product.save();
  }

  async getBestSelling(): Promise<Product[]> {
    return this.productModel
      .find({ bestSelling: true, isActive: true })
      .limit(10)
      .exec();
  }

  async getTopRated(): Promise<Product[]> {
    return this.productModel
      .find({ topRated: true, isActive: true })
      .limit(10)
      .exec();
  }
}
