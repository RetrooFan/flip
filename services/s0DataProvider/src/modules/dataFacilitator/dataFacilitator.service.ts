import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GetOrdersQueryDto } from './dtos/getOrdersQueryDto';
import { Order, OrderDocument } from '../../../../../shared/src/entities/order.entity';
import { DbConnection } from '../../../../../shared/src/enums/dbConnection.enum';
import { SetDateTimeQueryDto } from './dtos/setDateTimeQueryDto';
import { DateEntity, DateEntityDocument } from '../../../../../shared/src/entities/dateEntity.entity';

@Injectable()
export class DataFacilitatorService {
  private date: Date;

  constructor(
    @InjectModel(Order.name, DbConnection.DataFacilitator)
    private readonly orderModel: Model<OrderDocument>,
    @InjectModel(DateEntity.name, DbConnection.DataFacilitator)
    private readonly dateEntityModel: Model<DateEntityDocument>,
  ) {
    this.date = new Date('2000-01-01');

  public async onModuleInit(): Promise<void> {
    const dateEntity = await this.dateEntityModel.findOne<DateEntity>();

    if (!dateEntity) {
      const value = new Date('2000-01-01');
      new this.dateEntityModel({ value }).save();

      return;
    }
  }

  public async getOrders(getOrdersQueryDto: GetOrdersQueryDto): Promise<Order[]> {
    const skipItemsNumber = getOrdersQueryDto._limit * (getOrdersQueryDto._page - 1);

    const date = await this.dateEntityModel.findOne<DateEntity>();

    return await this.orderModel
      .find<Order>({ date: { $lte: date.value } })
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
