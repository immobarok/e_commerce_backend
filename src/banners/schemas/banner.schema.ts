import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BannerDocument = Banner & Document;

@Schema({ timestamps: true })
export class Banner {
    @Prop({ required: true, trim: true })
    title: string;

    @Prop({ required: true, trim: true })
    label: string;

    @Prop({ required: true })
    description: string;

    @Prop({ type: [String], required: true })
    images: string[];

    @Prop({ default: Date.now })
    postedDate: Date;

    @Prop()
    timeToRead: string;

    @Prop({ required: true, trim: true, unique: true })
    slug: string;
}

export const BannerSchema = SchemaFactory.createForClass(Banner);
