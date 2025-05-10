import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DateOfOrderCountsDocument = DateOfOrderCounts & Document;

@Schema({ timestamps: true, capped: { max: 1, size: 1 } })
export class DateOfOrderCounts {
  @Prop({ required: true })
  value: string;
}

export const dateOfOrderCountsSchema = SchemaFactory.createForClass(DateOfOrderCounts);
