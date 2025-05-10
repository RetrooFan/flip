import { ConsoleLogger, Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class CronService {
  constructor(private readonly schedulerRegistry: SchedulerRegistry, private readonly consoleLogger: ConsoleLogger) {}

  addJob(name: string, cronTime: string, trigger: () => Promise<void>): void {
    const messageAdd = `Cron job added with [${cronTime}]`;
    const messageExecuteStarted = `Cron job execution started`;
    const messageExecuteFinished = `Cron job execution finished`;

    const job = new CronJob(cronTime, async () => {
      this.consoleLogger.log(messageExecuteStarted, name);

      await trigger();

      this.consoleLogger.log(messageExecuteFinished, name);
    });

    this.schedulerRegistry.addCronJob(name, job);
    job.start();

    this.consoleLogger.log(messageAdd, name);
  }
}
