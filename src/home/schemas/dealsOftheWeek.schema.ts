import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class DealsOfTheWeek extends Document {
    @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
    productId: Types.ObjectId;

    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    image: string;

    @Prop({ required: true, type: Number })
    price: number;

    @Prop({ required: true, type: Number })
    discountPrice: number;

    @Prop({ required: true, type: Number })
    discountPercentage: number;

    @Prop({ required: true, type: Number })
    stock: number;
}

export const DealsOfTheWeekSchema = SchemaFactory.createForClass(DealsOfTheWeek);
