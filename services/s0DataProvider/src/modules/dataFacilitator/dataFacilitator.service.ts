import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DataFacilitatorQueryDto } from './dtos/dataFacilitatorQuery.dto';
import { Order, OrderDocument } from '../../../../../shared/src/entities/order.entity';
import { DbConnection } from '../../../../../shared/src/enums/dbConnection.enum';

@Injectable()
export class DataFacilitatorService {
  constructor(
    @InjectModel(Order.name, DbConnection.DataFacilitator)
    private readonly orderModel: Model<OrderDocument>,
  ) {}

  public async getOrders(dataFacilitatorQueryDto: DataFacilitatorQueryDto): Promise<Order[]> {
    const skipItemsNumber = dataFacilitatorQueryDto._limit * (dataFacilitatorQueryDto._page - 1);

    return await this.orderModel.find().skip(skipItemsNumber).limit(dataFacilitatorQueryDto._limit);
  }
}
