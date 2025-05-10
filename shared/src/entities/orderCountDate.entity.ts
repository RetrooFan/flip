import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrderCountDateDocument = OrderCountDate & Document;

@Schema({ timestamps: true, capped: { max: 1, size: 1 } })
export class OrderCountDate {
  @Prop({ required: true })
  value: string;
}

export const orderCountDateSchema = SchemaFactory.createForClass(OrderCountDate);
