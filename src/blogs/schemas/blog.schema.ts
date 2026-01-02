import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Blog extends Document {
  @Prop({ required: true, trim: true })
  label: string;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ default: Date.now })
  postedDate: Date;

  @Prop({ required: true })
  image: string;

  @Prop({ default: false })
  isSpotlight: boolean;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'BlogCategory', required: true })
  category: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  slug: string;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
