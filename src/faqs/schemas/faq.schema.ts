import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Faq extends Document {
  @Prop({ required: true })
  category: string;

  @Prop({
    type: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
      },
    ],
    required: true,
  })
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

export const FaqSchema = SchemaFactory.createForClass(Faq);
