import { Injectable } from '@nestjs/common';
import { CronService } from '../../../../../shared/src/modules/cron/cron.service';

@Injectable()
export class DataAnalyzerService {
  constructor(cronService: CronService) {
    cronService.addJob(DataAnalyzerService.name, process.env.DATA_ANALYZER_CRON_TIME, analyzeData);
  }
}

async function analyzeData(): Promise<void> {
  console.log('BLA', DataAnalyzerService.name);
}
