import { ConsoleLogger, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  AmountOfAnalyzedOrders,
  AmountOfAnalyzedOrdersDocument,
} from '../../../../../shared/src/entities/amountOfAnalyzedOrders.entity';
import { MetricsOfProduct, MetricsOfProductDocument } from '../../../../../shared/src/entities/metricsOfProduct.entity';
import { Order } from '../../../../../shared/src/entities/order.entity';
import {
  DateOfOrderCounts,
  DateOfOrderCountsDocument,
} from '../../../../../shared/src/entities/dateOfOrderCounts.entity';
import { DbConnection } from '../../../../../shared/src/enums/dbConnection.enum';
import { AxiosService } from '../../../../../shared/src/modules/axios/axios.service';
import { CronService } from '../../../../../shared/src/modules/cron/cron.service';
import { errorRethrower } from '../../../../../shared/src/utils';
import { S1DataAnalyzerUnknownError } from '../../errors/s1DataAnalyzer.error';

@Injectable()
export class DataAnalyzerService {
  constructor(
    private readonly cronService: CronService,
    private readonly axiosService: AxiosService,
    @InjectModel(AmountOfAnalyzedOrders.name, DbConnection.DataAnalyzer)
    private readonly amountOfAnalyzedOrdersModel: Model<AmountOfAnalyzedOrdersDocument>,
    private readonly configService: ConfigService,
    @InjectModel(MetricsOfProduct.name, DbConnection.DataAnalyzer)
    private readonly metricsOfProductModel: Model<MetricsOfProductDocument>,
    private readonly consoleLogger: ConsoleLogger,
    @InjectModel(DateOfOrderCounts.name, DbConnection.DataAnalyzer)
    private readonly dateOfOrderCountsModel: Model<DateOfOrderCountsDocument>,
  ) {
    this.addCronJobs();
  }

  private addCronJobs(): void {
    this.cronService.addJob('DATA_ANALYZER_CRON_TIME', this.configService.get<string>('dataAnalyzerCronTime'), () =>
      errorRethrower(this.dataAnalyzerCronCallback(), S1DataAnalyzerUnknownError),
    );
  }

  private async dataAnalyzerCronCallback(): Promise<void> {
    let amountOfAnalyzedOrders = await this.amountOfAnalyzedOrdersModel.findOne<AmountOfAnalyzedOrders>();

    if (!amountOfAnalyzedOrders) {
      amountOfAnalyzedOrders = await new this.amountOfAnalyzedOrdersModel({ value: 0 }).save();
    }

    const currentValue = amountOfAnalyzedOrders ? amountOfAnalyzedOrders.value : 0;
    const limit = this.configService.get<number>('itemsNumberQueryLimit');
    const page = Math.trunc(currentValue / limit) + 1;

    const baseURL = this.configService.get<string>('dataSourceApi');
    const url = 'orders';
    const params = { _page: page, _limit: limit };

    const data = await this.axiosService.request<Order[]>({ baseURL, url, params });
    const value = (page - 1) * limit + data.length;
    const counter = currentValue % limit;

    for (let i = counter; i < data.length; i++) {
      const dateOfOrderCounts = await this.dateOfOrderCountsModel.findOne<DateOfOrderCounts>();
      const date = new Date(data[i].date);
      const value = date.toISOString().split('T')[0];

      if (!dateOfOrderCounts) {
        new this.dateOfOrderCountsModel({ value }).save();
      } else if (dateOfOrderCounts.value !== value) {
        await this.orderCountReset(value);
        new this.dateOfOrderCountsModel({ value }).save();
      }

      for (const item of data[i].items) {
        let metricsOfProduct = await this.metricsOfProductModel.findById<MetricsOfProduct>(item.product.id);

        if (metricsOfProduct) {
          metricsOfProduct.salesValue += item.quantity * item.product.price;
          metricsOfProduct.orderCountTotal++;
          metricsOfProduct.orderCountToday++;
        } else {
          metricsOfProduct = {
            _id: item.product.id,
            name: item.product.name,
            salesValue: item.quantity * item.product.price,
            orderCountTotal: 1,
            orderCountToday: 1,
            orderCountYesterday: 0,
          };
        }

        new this.metricsOfProductModel(metricsOfProduct).save();
      }
    }

    if (value > currentValue && data.length) {
      amountOfAnalyzedOrders.value = value;
      await new this.amountOfAnalyzedOrdersModel(amountOfAnalyzedOrders).save();
    }

    const message = `Analyzed ${data.length - counter} orders. Analyzed in total: ${value}`;
    this.consoleLogger.log(message, DataAnalyzerService.name);
  }

  private async orderCountReset(date: string): Promise<void> {
    const metricsOfProducts = await this.metricsOfProductModel.find<MetricsOfProduct>();

    for (const metricsOfProduct of metricsOfProducts) {
      metricsOfProduct.orderCountYesterday = metricsOfProduct.orderCountToday;
      metricsOfProduct.orderCountToday = 0;

      await new this.metricsOfProductModel(metricsOfProduct).save();
    }

    this.consoleLogger.log(`Order counts reseted, current date: ${date}`, DataAnalyzerService.name);
  }
}
