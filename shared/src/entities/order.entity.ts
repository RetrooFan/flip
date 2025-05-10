import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Customer } from '../types/customer.type';
import { Item } from '../types/item.type';

export const orderToken = 'order';
export type OrderDocument = Order & Document;

@Schema()
export class Order {
  @Prop({ required: true, index: 1 })
  date: Date;

  @Prop({ required: true })
  customer: Customer;

  @Prop({ required: true })
  item: Item;
}

export const orderSchema = SchemaFactory.createForClass(Order);
