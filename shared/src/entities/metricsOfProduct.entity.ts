import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MetricsOfProductDocument = MetricsOfProduct & Document;

@Schema({ timestamps: true })
export class MetricsOfProduct {
  @Prop({ required: true, alias: 'id' })
  _id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true, index: -1 })
  salesValue: number;

  @Prop({ required: true, index: -1 })
  orderCountTotal: number;

  @Prop({ required: true })
  orderCountToday: number;

  @Prop({ required: true, index: -1 })
  orderCountYesterday: number;
}

export const MetricsOfProductSchema = SchemaFactory.createForClass(MetricsOfProduct);
