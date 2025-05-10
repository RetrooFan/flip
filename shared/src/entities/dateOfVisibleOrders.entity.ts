import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DateOfVisibleOrdersDocument = DateOfVisibleOrders & Document;

@Schema({ timestamps: true, capped: { max: 1, size: 1 } })
export class DateOfVisibleOrders {
  @Prop({ required: true })
  value: Date;
}

export const dateOfVisibleOrdersSchema = SchemaFactory.createForClass(DateOfVisibleOrders);
