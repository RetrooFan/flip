import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AmountOfOrdersDocument = AmountOfOrders & Document;

@Schema({ timestamps: true, capped: { max: 1, size: 1 } })
export class AmountOfOrders {
  @Prop({ required: true })
  value: number;
}

export const amountOfOrdersSchema = SchemaFactory.createForClass(AmountOfOrders);
