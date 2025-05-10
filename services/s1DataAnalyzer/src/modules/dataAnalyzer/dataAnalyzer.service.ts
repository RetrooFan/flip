import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LastOrder, LastOrderDocument } from '../../../../../shared/src/entities/lastOrder.entity';
import { DbConnection } from '../../../../../shared/src/enums/dbConnection.enum';
import { CronService } from '../../../../../shared/src/modules/cron/cron.service';
import { errorRethrower } from '../../../../../shared/src/utils';
import { S1DataAnalyzerUnknownError } from '../../errors/s1DataAnalyzer.error';

@Injectable()
export class DataAnalyzerService {
  private message = 'BLA';

  constructor(
    private readonly cronService: CronService,
    @InjectModel(LastOrder.name, DbConnection.DataAnalyzer)
    private readonly orderModel: Model<LastOrderDocument>,
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
    console.log(this.message, DataAnalyzerService.name);
  }

  private async productYesterdayCounterCallback(): Promise<void> {
    console.log(this.message, DataAnalyzerService.name);
  }
}
