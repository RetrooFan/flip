import { ConsoleLogger, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AxiosStatic } from 'axios';
import { Response } from 'express';
import { Model } from 'mongoose';
import { Order, OrderDocument } from '../../../../../shared/src/entities/order.entity';
import { DbConnection } from '../../../../../shared/src/enums/dbConnection.enum';
import { AxiosService } from '../../../../../shared/src/modules/axios/axios.service';

@Injectable()
export class DataFetcherService {
  private readonly axiosInstance: AxiosStatic;

  constructor(
    axiosService: AxiosService,
    private readonly consoleLogger: ConsoleLogger,
    @InjectModel(Order.name, DbConnection.DataFetcher)
    private readonly orderModel: Model<OrderDocument>,
  ) {
    this.axiosInstance = axiosService.getAxios();
  }

  public async loadData(response: Response): Promise<void> {
    response.status(HttpStatus.OK).send('Data loading started!');

    await this.fetchData(parseInt(process.env.ITEMS_NUMBER));
  }

  private async fetchData(itemsNumber: number): Promise<Order[]> {
    const queryLimit = parseInt(process.env.ITEMS_NUMBER_QUERY_LIMIT);
    const limit = itemsNumber < queryLimit ? itemsNumber : queryLimit;
    const promisesNumber = Math.ceil(itemsNumber / limit);
    const orders: Order[] = [];
    const message = `Loading ${itemsNumber} items`;
    let page = 1;

    this.consoleLogger.log(`${message} - 0 %`, 'DataFetcherService');

    for (let i = 0; i < promisesNumber; i++) {
      const params = { _page: page, _limit: limit };

      const result = await this.axiosInstance.get('orders', {
        params,
        baseURL: process.env.DATA_SOURCE_API,
      });

      orders.push(...result.data);

      this.consoleLogger.log(`${message} - ${Math.round((page * 100) / promisesNumber)} %`, 'DataFetcherService');

      page++;
    }

    return orders;
  }
}
