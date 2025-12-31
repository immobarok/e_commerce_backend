import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Product extends Document {
  @Prop({ required: true })
  productName: string;
  
  @Prop({ required: true, unique: true, index: true })
  slug: string;

  @Prop({ required: true, unique: true, index: true })
  productCode: string;

  @Prop({ required: true })
  shortDescription: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, type: Number })
  price: number;

  @Prop({ type: Number, default: null, required: false })
  discountPrice: number | null;

  @Prop({ required: true })
  category: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ type: Boolean, default: false })
  bestSelling: boolean;

  @Prop({ type: Boolean, default: false })
  topRated: boolean;

  @Prop({ type: Number, default: 0 })
  stock: number;

  @Prop({ type: Number, default: 0 })
  rating: number;

  @Prop({ type: Number, default: 0 })
  reviewCount: number;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
