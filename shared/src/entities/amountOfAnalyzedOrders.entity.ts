import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AmountOfAnalyzedOrdersDocument = AmountOfAnalyzedOrders & Document;

@Schema({ timestamps: true, capped: { max: 1, size: 1 } })
export class AmountOfAnalyzedOrders {
  @Prop({ required: true })
  value: number;
}

export const amountOfAnalyzedOrdersSchema = SchemaFactory.createForClass(AmountOfAnalyzedOrders);
