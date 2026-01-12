import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true })
export class Banner extends Document {
    @Prop({ required: true })
    label: string;

    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    image: string;

    @Prop()
    link?: string;
}

export const BannerSchema = SchemaFactory.createForClass(Banner);
