import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SystemDocument = System & Document;

@Schema()
class SocialMedia {
  @Prop({ required: true })
  platform: string;

  @Prop({ required: true })
  url: string;
}

@Schema({ timestamps: true })
export class System {
  @Prop({ type: [String], default: [] })
  gallery: string[];

  @Prop({ type: [SocialMedia], default: [] })
  socialMedia: SocialMedia[];

  @Prop({ default: 0 })
  deliveryCharge: number;

  @Prop()
  systemName: string;
}

export const SystemSchema = SchemaFactory.createForClass(System);
