import { ConsoleLogger, Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { logError } from '../../utils';

@Injectable()
export class CronService {
  constructor(private readonly schedulerRegistry: SchedulerRegistry, private readonly consoleLogger: ConsoleLogger) {}

  addJob(name: string, cronTime: string, callback: () => Promise<void>): void {
    const messageAdd = `Cron job ${name} added with [${cronTime}]`;
    const messageExecuteStarted = `Cron job ${name} execution started`;
    const messageExecuteFinished = `Cron job ${name} execution finished`;

    const callbackHandled = async (): Promise<void> => {
      const start = Date.now();

      this.consoleLogger.log(messageExecuteStarted, CronService.name);

      try {
        await callback();
      } catch (error) {
        logError(this.consoleLogger, error, CronService.name);
      }

      const end = Date.now();
      const duration = end - start;

      this.consoleLogger.log(`${messageExecuteFinished} in ${duration} ms\n`, CronService.name);
    };

    const job = new CronJob(cronTime, callbackHandled);

    this.schedulerRegistry.addCronJob(name, job);
    job.start();

    this.consoleLogger.log(messageAdd, CronService.name);
  }
}
