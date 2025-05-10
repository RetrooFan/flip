import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GetOrdersQueryDto } from './dtos/getOrdersQueryDto';
import { Order, OrderDocument } from '../../../../../shared/src/entities/order.entity';
import { DbConnection } from '../../../../../shared/src/enums/dbConnection.enum';

@Injectable()
export class DataFacilitatorService {
  constructor(
    @InjectModel(Order.name, DbConnection.DataFacilitator)
    private readonly orderModel: Model<OrderDocument>,
  ) {}
  public async getOrders(getOrdersQueryDto: GetOrdersQueryDto): Promise<Order[]> {
    const skipItemsNumber = getOrdersQueryDto._limit * (getOrdersQueryDto._page - 1);

    return await this.orderModel.find().skip(skipItemsNumber).limit(getOrdersQueryDto._limit).sort({ date: 1 });

  }
}
