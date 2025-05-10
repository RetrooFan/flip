import { Injectable } from '@nestjs/common';
import { CronService } from '../../../../../shared/src/modules/cron/cron.service';
import { errorRethrower } from '../../../../../shared/src/utils';
import { S1DataAnalyzerError } from '../../errors/s1DataAnalyzer.error';

@Injectable()
export class DataAnalyzerService {
  constructor(cronService: CronService) {
    cronService.addJob(DataAnalyzerService.name, process.env.DATA_ANALYZER_CRON_TIME, () =>
      errorRethrower(analyzeData(), S1DataAnalyzerError),
    );
  }
}

async function analyzeData(): Promise<void> {
  console.log('BLA', DataAnalyzerService.name);
}
