import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Order extends Document {
    @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
    productId: Types.ObjectId;

    @Prop({ required: true, type: Number })
    quantity: number;

    @Prop({ type: Date, default: Date.now })
    createdAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
