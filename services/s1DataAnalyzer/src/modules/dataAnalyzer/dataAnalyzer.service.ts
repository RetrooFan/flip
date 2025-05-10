import { Injectable } from '@nestjs/common';
import { CronService } from '../../../../../shared/src/modules/cron/cron.service';
import { errorRethrower } from '../../../../../shared/src/utils';
import { S1DataAnalyzerUnknownError } from '../../errors/s1DataAnalyzer.error';

@Injectable()
export class DataAnalyzerService {
  private message = 'BLA';

  constructor(private readonly cronService: CronService) {
    this.addCronJobs();
  }

  private addCronJobs(): void {
    this.cronService.addJob('DATA_ANALYZER_CRON_TIME', process.env.DATA_ANALYZER_CRON_TIME, () =>
      errorRethrower(this.dataAnalyzerCronCallback(), S1DataAnalyzerUnknownError),
    );

    this.cronService.addJob('PRODUCT_YESTERDAY_COUNTER_TIME', process.env.PRODUCT_YESTERDAY_COUNTER_TIME, () =>
      errorRethrower(this.productYesterdayCounterCallback(), S1DataAnalyzerUnknownError),
    );
  }

  private async dataAnalyzerCronCallback(): Promise<void> {
    console.log(this.message, DataAnalyzerService.name);
  }

  private async productYesterdayCounterCallback(): Promise<void> {
    console.log(this.message, DataAnalyzerService.name);
  }
}
