import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AmountOfOrders, AmountOfOrdersDocument } from '../../../../../shared/src/entities/amountOfOrders.entity';
import { Order } from '../../../../../shared/src/entities/order.entity';
import { DbConnection } from '../../../../../shared/src/enums/dbConnection.enum';
import { AxiosService } from '../../../../../shared/src/modules/axios/axios.service';
import { CronService } from '../../../../../shared/src/modules/cron/cron.service';
import { errorRethrower } from '../../../../../shared/src/utils';
import { S1DataAnalyzerUnknownError } from '../../errors/s1DataAnalyzer.error';

@Injectable()
export class DataAnalyzerService {
  private message = 'BLA';

  constructor(
    private readonly cronService: CronService,
    private readonly axiosService: AxiosService,
    @InjectModel(AmountOfOrders.name, DbConnection.DataAnalyzer)
    private readonly amountOfOrdersModel: Model<AmountOfOrdersDocument>,
    private readonly configService: ConfigService,
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
    const currentAmount = await this.amountOfOrdersModel.findOne();
    const currentValue = currentAmount ? currentAmount.value : 0;

    const limit = this.configService.get<number>('itemsNumberQueryLimit');
    const page = Math.trunc(currentValue / limit) + 1;

    const baseURL = this.configService.get<string>('dataSourceApi');
    const url = 'orders';
    const params = { _page: page, _limit: limit };

    const data = await this.axiosService.request<Order[]>({ baseURL, url, params });
    const value = (page - 1) * limit + data.length;
    const counter = currentValue % limit;

    for (let i = counter; i < data.length; i++) {}

    if (value > currentValue && data.length) {
      new this.amountOfOrdersModel({ value }).save();
    }
  }

  private async productYesterdayCounterCallback(): Promise<void> {
    console.log(this.message, DataAnalyzerService.name);
  }
}
