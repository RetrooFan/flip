import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LastOrderDocument = LastOrder & Document;

@Schema({ timestamps: true, capped: { max: 1, size: 1 } })
export class LastOrder {
  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  page: number;
}

export const lastOrderSchema = SchemaFactory.createForClass(LastOrder);
