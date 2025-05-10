import { Injectable } from '@nestjs/common';
import { CronService } from '../../../../../shared/src/modules/cron/cron.service';
import { errorRethrower } from '../../../../../shared/src/utils';
import { S1DataAnalyzerUnknownError } from '../../errors/s1DataAnalyzer.error';

@Injectable()
export class DataAnalyzerService {
  private message = 'BLA';

  constructor(cronService: CronService) {
    cronService.addJob('DATA_ANALYZER_CRON_TIME', process.env.DATA_ANALYZER_CRON_TIME, () =>
      errorRethrower(this.analyzeData(), S1DataAnalyzerUnknownError),
    );
  }

  public async analyzeData(): Promise<void> {
    console.log(this.message, DataAnalyzerService.name);
  }
}
