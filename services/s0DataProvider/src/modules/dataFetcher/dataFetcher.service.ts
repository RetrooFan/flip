import { ConsoleLogger, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AxiosResponse, AxiosStatic } from 'axios';
import { Response } from 'express';
import { Model } from 'mongoose';
import { DataFetcherQueryDto } from '../../../../../shared/src/dtos/dataFetcherParams.dto';
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

  public async loadData(response: Response, dataFetcherQueryDto: DataFetcherQueryDto): Promise<void> {
    response.status(HttpStatus.OK).send('Data loading started!');

    await this.fetchData(dataFetcherQueryDto.startPage, dataFetcherQueryDto.endPage);
  }

  private async fetchData(startPage: number, endPage: number): Promise<Order[]> {
    const limit = parseInt(process.env.ITEMS_NUMBER_QUERY_LIMIT);
    const pagesNumber = endPage - startPage + 1;
    const itemsNumber = pagesNumber * limit;
    const orders: Order[] = [];
    const message = `Loading pages ${startPage} - ${endPage} (${itemsNumber} items)`;

    this.consoleLogger.log(`${message} - 0 %`, 'DataFetcherService');

    for (let i = startPage; i < endPage + 1; i++) {
      const params = { _page: i, _limit: limit };

      let data: Order[];

      try {
        const baseURL = process.env.DATA_SOURCE_API;
        ({ data } = await this.axiosInstance.get('orders', { params, baseURL }));
      } catch (error) {
        data = [];
        this.consoleLogger.error(error, 'DataFetcherService');
      }

      orders.push(...data);

      this.consoleLogger.log(
        `${message} - ${Math.round(((i - startPage + 1) * 100) / pagesNumber)} %`,
        'DataFetcherService',
      );
    }

    return orders;
  }
}
