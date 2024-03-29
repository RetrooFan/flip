import { ConsoleLogger, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoadDataQueryDto } from './dtos/dataFetcherQuery.dto';
import { Order, OrderDocument } from '../../../../../shared/src/entities/order.entity';
import { DbConnection } from '../../../../../shared/src/enums/dbConnection.enum';
import { AxiosService } from '../../../../../shared/src/modules/axios/axios.service';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@Injectable()
export class DataFetcherService {
  private stopLoadingFlag: boolean;
  private abortLoadingFlag: boolean;
  private loadingRunning = false;

  constructor(
    private readonly axiosService: AxiosService,
    private readonly consoleLogger: ConsoleLogger,
    @InjectModel(Order.name, DbConnection.DataFetcher)
    private readonly orderModel: Model<OrderDocument>,
    private readonly configService: ConfigService,
  ) {}

  public async loadData(response: Response, loadDataQueryDto: LoadDataQueryDto): Promise<void> {
    await this.ensureLoadingRunningReseted(response, loadDataQueryDto);
  }

  public async stopLoading(): Promise<string> {
    this.stopLoadingFlag = true;
    const message = 'Data loading stopped!';

    this.consoleLogger.warn(message, DataFetcherService.name);

    return message;
  }

  public async abortLoading(): Promise<string> {
    this.abortLoadingFlag = true;
    const message = 'Data loading aborted!';

    this.consoleLogger.warn(message, DataFetcherService.name);

    return message;
  }

  public async read(): Promise<Order[]> {
    return await this.orderModel.find<Order>().skip(0).limit(10);
  }

  private async fetchData(startPage: number, endPage: number): Promise<Order[]> {
    this.stopLoadingFlag = false;
    this.abortLoadingFlag = false;

    const limit = this.configService.get<number>('itemsNumberQueryLimit');
    const pagesNumber = endPage - startPage + 1;
    const itemsNumber = pagesNumber * limit;
    const orders: Order[] = [];
    const initialMessage = `Loading pages ${startPage} - ${endPage} (${pagesNumber} pages - ${itemsNumber} items)`;

    this.consoleLogger.log(`${initialMessage} - 0 %`, DataFetcherService.name);

    for (let i = startPage; i < endPage + 1; i++) {
      const baseURL = this.configService.get<string>('dataSourceApi');
      const url = 'orders';
      const params = { _page: i, _limit: limit };
      let data: Order[] = [];

      try {
        data = await this.axiosService.request<Order[]>({ baseURL, url, params });
        orders.push(...data);
      } catch (error) {
        this.consoleLogger.error(error, DataFetcherService.name);
      }

      const message = `Loaded page ${i} (${data.length} items)`;
      this.consoleLogger.log(
        `${message} - ${Math.round(((i - startPage + 1) * 100) / pagesNumber)} %\n`,
        DataFetcherService.name,
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

    this.consoleLogger.log(`Saving records started: ${orders.length}`, DataFetcherService.name);

    for (let i = 0; i < orders.length; i++) {
      try {
        await new this.orderModel(orders[i]).save();
        fulfilledCounter++;
      } catch (error) {
        rejectedCounter++;
        // this.consoleLogger.error(error, DataFetcherService.name);
      }
    }

    if (rejectedCounter) {
      this.consoleLogger.error(`Failed saving records: ${rejectedCounter}`, DataFetcherService.name);
    }

    if (fulfilledCounter) {
      this.consoleLogger.log(`Saved records: ${fulfilledCounter}`, DataFetcherService.name);
    }
  }

  private async ensureLoadingRunningReseted(response: Response, loadDataQueryDto: LoadDataQueryDto): Promise<void> {
    if (this.loadingRunning) {
      response.status(HttpStatus.OK).send('Data loading currently running! Not started!');

      return;
    }
    this.loadingRunning = true;

    response.status(HttpStatus.OK).send('Data loading started!');

    try {
      const orders = await this.fetchData(loadDataQueryDto.startPage, loadDataQueryDto.endPage);

      await this.saveData(orders);
    } catch (error) {
      throw error;
    } finally {
      this.loadingRunning = false;
    }
  }
}
