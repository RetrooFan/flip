import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GetOrdersQueryDto } from './dtos/getOrdersQueryDto';
import { Order, OrderDocument } from '../../../../../shared/src/entities/order.entity';
import { DbConnection } from '../../../../../shared/src/enums/dbConnection.enum';
import {
  DateOfVisibleOrders,
  DateOfVisibleOrdersDocument,
} from '../../../../../shared/src/entities/dateOfVisibleOrders.entity';

@Injectable()
export class DataFacilitatorService {
  constructor(
    @InjectModel(Order.name, DbConnection.DataFacilitator)
    private readonly orderModel: Model<OrderDocument>,
    @InjectModel(DateOfVisibleOrders.name, DbConnection.DataFacilitator)
    private readonly dateOfVisibleOrdersModel: Model<DateOfVisibleOrdersDocument>,
  ) {}

  public async onModuleInit(): Promise<void> {
    const dateOfVisibleOrders = await this.dateOfVisibleOrdersModel.findOne<DateOfVisibleOrders>();

    if (!dateOfVisibleOrders) {
      const value = new Date('2000-01-01');
      new this.dateOfVisibleOrdersModel({ value }).save();

      return;
    }
  }

  public async getOrders(getOrdersQueryDto: GetOrdersQueryDto): Promise<Order[]> {
    const skipItemsNumber = getOrdersQueryDto._limit * (getOrdersQueryDto._page - 1);

    const dateOfVisibleOrders = await this.dateOfVisibleOrdersModel.findOne<DateOfVisibleOrders>();

    return await this.orderModel
      .find<Order>({ date: { $lte: dateOfVisibleOrders.value } })
      .skip(skipItemsNumber)
      .limit(getOrdersQueryDto._limit)
      .sort({ date: 1 });
  }
}
