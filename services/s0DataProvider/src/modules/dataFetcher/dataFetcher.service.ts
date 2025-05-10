import { ConsoleLogger, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AxiosStatic } from 'axios';
import { Model } from 'mongoose';
import DataFetcherQueryDto from 'services/s0DataProvider/src/modules/dataFetcher/dtos/dataFetcherQuery.dto';
import { Order, OrderDocument } from '../../../../../shared/src/entities/order.entity';
import { DbConnection } from '../../../../../shared/src/enums/dbConnection.enum';
import { AxiosService } from '../../../../../shared/src/modules/axios/axios.service';

@Injectable()
export default class DataFetcherService {
  private readonly axiosInstance: AxiosStatic;
  private readonly serviceName: string;
  private stopLoadingFlag: boolean;
  private abortLoadingFlag: boolean;

  constructor(
    axiosService: AxiosService,
    private readonly consoleLogger: ConsoleLogger,
    @InjectModel(Order.name, DbConnection.DataFetcher)
    private readonly orderModel: Model<OrderDocument>,
  ) {
    this.axiosInstance = axiosService.getAxios();
    this.serviceName = DataFetcherService.name;
  }

  public async loadData(dataFetcherQueryDto: DataFetcherQueryDto): Promise<void> {
    const orders = await this.fetchData(dataFetcherQueryDto.startPage, dataFetcherQueryDto.endPage);

    await this.saveData(orders);
  }

  public stopLoading(): string {
    this.stopLoadingFlag = true;
    const message = 'Data loading stopped!';

    this.consoleLogger.warn(message, this.serviceName);

    return message;
  }

  public abortLoading(): string {
    this.abortLoadingFlag = true;
    const message = 'Data loading aborted!';

    this.consoleLogger.warn(message, this.serviceName);

    return message;
  }

  public async read(): Promise<Order[]> {
    const orders: Order[] = await this.orderModel.find().skip(0).limit(10);

    return orders;
  }

  private async fetchData(startPage: number, endPage: number): Promise<Order[]> {
    const limit = parseInt(process.env.ITEMS_NUMBER_QUERY_LIMIT);
    const pagesNumber = endPage - startPage + 1;
    const itemsNumber = pagesNumber * limit;
    const orders: Order[] = [];
    const initialMessage = `Loading pages ${startPage} - ${endPage} (${pagesNumber} pages - ${itemsNumber} items)`;

    this.consoleLogger.log(`${initialMessage} - 0 %`, this.serviceName);
    this.stopLoadingFlag = false;
    this.abortLoadingFlag = false;

    for (let i = startPage; i < endPage + 1; i++) {
      const params = { _page: i, _limit: limit };

      let data: Order[];

      try {
        const baseURL = process.env.DATA_SOURCE_API;
        ({ data } = await this.axiosInstance.get('orders', { params, baseURL }));
      } catch (error) {
        data = [];
        this.consoleLogger.error(error, this.serviceName);
      }

      orders.push(...data);

      const message = `Loaded page ${i} (${data.length} items)`;
      this.consoleLogger.log(
        `${message} - ${Math.round(((i - startPage + 1) * 100) / pagesNumber)} %`,
        this.serviceName,
      );

      if (this.stopLoadingFlag) {
        this.stopLoadingFlag = false;
        break;
      }

      if (this.abortLoadingFlag) {
        this.abortLoadingFlag = false;
        return [];
      }
    }

    return orders;
  }

  private async saveData(orders: Order[]): Promise<void> {
    let rejectedCounter = 0;
    let fulfilledCounter = 0;

    for (let i = 0; i < orders.length; i++) {
      try {
        await new this.orderModel(orders[i]).save();
        fulfilledCounter++;
      } catch (error) {
        rejectedCounter++;
        // this.consoleLogger.error(error, this.serviceName);
      }
    }

    if (rejectedCounter) {
      this.consoleLogger.error(`Rejected requests: ${rejectedCounter}`, this.serviceName);
    }

    if (fulfilledCounter) {
      this.consoleLogger.log(`Fulfilled requests: ${fulfilledCounter}`, this.serviceName);
    }
  }
}
