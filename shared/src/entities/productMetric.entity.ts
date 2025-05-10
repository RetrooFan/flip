import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrderDocument = ProductMetric & Document;

@Schema({ timestamps: true })
export class ProductMetric {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  salesValue: number;

  @Prop({ required: true })
  orderCountTotal: number;

  @Prop({ required: true })
  orderCountToday: number;

  @Prop({ required: true })
  orderCountYesterday: number;
}

export const productMetricSchema = SchemaFactory.createForClass(ProductMetric);
