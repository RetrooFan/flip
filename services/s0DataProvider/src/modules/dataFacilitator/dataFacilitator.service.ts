import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GetOrdersQueryDto } from './dtos/getOrdersQueryDto';
import { Order, OrderDocument } from '../../../../../shared/src/entities/order.entity';
import { DbConnection } from '../../../../../shared/src/enums/dbConnection.enum';
import { SetDateTimeQueryDto } from './dtos/setDateTimeQueryDto';

@Injectable()
export class DataFacilitatorService {
  private date: Date;

  constructor(
    @InjectModel(Order.name, DbConnection.DataFacilitator)
    private readonly orderModel: Model<OrderDocument>,
  ) {
    this.date = new Date('2000-01-01');
  }

  public async getOrders(getOrdersQueryDto: GetOrdersQueryDto): Promise<Order[]> {
    const skipItemsNumber = getOrdersQueryDto._limit * (getOrdersQueryDto._page - 1);

    return await this.orderModel
      .find({ date: { $lte: this.date } })
      .skip(skipItemsNumber)
      .limit(getOrdersQueryDto._limit)
      .sort({ date: 1 });
  }

  public async setDateTime(setDateTimeQueryDto: SetDateTimeQueryDto): Promise<string> {
    const timeArray = setDateTimeQueryDto.time.split(':');
    const hours = parseInt(timeArray[0]);
    const minutes = parseInt(timeArray[1]);

    const date = new Date(setDateTimeQueryDto.date);
    date.setHours(hours);
    date.setMinutes(minutes);

    date.toString();

    this.date = date;

    return `Date ${date.toISOString()} set!`;
  }
}
