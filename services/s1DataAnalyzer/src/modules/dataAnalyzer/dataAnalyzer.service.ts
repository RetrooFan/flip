import { ConsoleLogger, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AmountOfOrders, AmountOfOrdersDocument } from '../../../../../shared/src/entities/amountOfOrders.entity';
import { MetricsOfProduct, MetricsOfProductDocument } from '../../../../../shared/src/entities/metricsOfProduct.entity';
import { Order } from '../../../../../shared/src/entities/order.entity';
import { DbConnection } from '../../../../../shared/src/enums/dbConnection.enum';
import { AxiosService } from '../../../../../shared/src/modules/axios/axios.service';
import { CronService } from '../../../../../shared/src/modules/cron/cron.service';
import { errorRethrower } from '../../../../../shared/src/utils';
import { S1DataAnalyzerUnknownError } from '../../errors/s1DataAnalyzer.error';

@Injectable()
export class DataAnalyzerService {
  private message = 'BLA';
  private analysisRunning = false;

  constructor(
    private readonly cronService: CronService,
    private readonly axiosService: AxiosService,
    @InjectModel(AmountOfOrders.name, DbConnection.DataAnalyzer)
    private readonly amountOfOrdersModel: Model<AmountOfOrdersDocument>,
    private readonly configService: ConfigService,
    @InjectModel(MetricsOfProduct.name, DbConnection.DataAnalyzer)
    private readonly metricsOfProduct: Model<MetricsOfProductDocument>,
    private readonly consoleLogger: ConsoleLogger,
  ) {
    this.addCronJobs();
  }

  private addCronJobs(): void {
    this.cronService.addJob('DATA_ANALYZER_CRON_TIME', this.configService.get<string>('dataAnalyzerCronTime'), () =>
      errorRethrower(this.dataAnalyzerCronCallback(), S1DataAnalyzerUnknownError),
    );

    this.cronService.addJob(
      'PRODUCT_YESTERDAY_COUNTER_TIME',
      this.configService.get<string>('productYesterdayCounterTime'),
      () => errorRethrower(this.productYesterdayCounterCallback(), S1DataAnalyzerUnknownError),
    );
  }

  private async dataAnalyzerCronCallback(): Promise<void> {
    if (this.analysisRunning) return;
    this.analysisRunning = true;

    const amountOfOrders = await this.amountOfOrdersModel.findOne<AmountOfOrders>();
    const currentValue = amountOfOrders ? amountOfOrders.value : 0;

    const limit = this.configService.get<number>('itemsNumberQueryLimit');
    const page = Math.trunc(currentValue / limit) + 1;

    const baseURL = this.configService.get<string>('dataSourceApi');
    const url = 'orders';
    const params = { _page: page, _limit: limit };

    const data = await this.axiosService.request<Order[]>({ baseURL, url, params });
    const value = (page - 1) * limit + data.length;
    const counter = currentValue % limit;

    for (let i = counter; i < data.length; i++) {
      for (const item of data[i].items) {
        let metricsOfProduct = await this.metricsOfProduct.findById<MetricsOfProduct>(item.product.id);

        if (metricsOfProduct) {
          metricsOfProduct.salesValue += item.quantity * item.product.price;
        } else {
          metricsOfProduct = {
            _id: item.product.id,
            name: item.product.name,
            salesValue: item.quantity * item.product.price,
            orderCountTotal: 0,
            orderCountToday: 0,
            orderCountYesterday: 0,
          };
        }

        new this.metricsOfProduct(metricsOfProduct).save();
      }
    }

    if (value > currentValue && data.length) {
      await new this.amountOfOrdersModel({ value }).save();
    }

    const message = `Analyzed ${data.length - counter} orders`;
    this.consoleLogger.log(message, DataAnalyzerService.name);

    this.analysisRunning = false;
  }

  private async productYesterdayCounterCallback(): Promise<void> {
    console.log(this.message, DataAnalyzerService.name);
  }
}
