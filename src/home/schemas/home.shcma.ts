import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class DisplayReview extends Document {
  @Prop({ required: true })
  reviewerName: string;

  @Prop({ required: true })
  rating: number;

  @Prop({ required: true })
  comment: string;

  @Prop({ required: true })
  date: Date;
}

export const DisplayReviewSchema = SchemaFactory.createForClass(DisplayReview);
