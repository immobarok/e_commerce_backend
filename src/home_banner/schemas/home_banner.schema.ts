import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type HomeBannerDocument = HomeBanner & Document;

@Schema({ timestamps: true })
export class HomeBanner {
    @Prop({ required: true })
    label: string;

    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    image: string;
}

export const HomeBannerSchema = SchemaFactory.createForClass(HomeBanner);

