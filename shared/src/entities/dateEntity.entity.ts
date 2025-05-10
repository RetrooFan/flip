import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DateEntityDocument = DateEntity & Document;

@Schema({ timestamps: true, capped: { max: 1, size: 1 } })
export class DateEntity {
  @Prop({ required: true })
  value: Date;
}

export const dateEntitySchema = SchemaFactory.createForClass(DateEntity);
