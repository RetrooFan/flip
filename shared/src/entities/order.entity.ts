import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Customer } from '../classes/customer.class';
import { Item } from '../classes/item.class';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true, alias: 'id' })
  _id: string;

  @Prop({ required: true, index: 1 })
  date: Date;

  @Prop({ required: true })
  customer: Customer;

  @Prop({ required: true })
  items: Item[];
}

export const orderSchema = SchemaFactory.createForClass(Order);
