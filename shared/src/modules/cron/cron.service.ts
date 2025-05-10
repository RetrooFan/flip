import { ConsoleLogger, Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class CronService {
  constructor(private readonly schedulerRegistry: SchedulerRegistry, private readonly consoleLogger: ConsoleLogger) {}

  addJob(name: string, cronTime: string, callback: () => Promise<void>): void {
    const messageAdd = `Cron job ${name} added with [${cronTime}]`;
    const messageExecuteStarted = `Cron job ${name} execution started`;
    const messageExecuteFinished = `Cron job ${name} execution finished`;

    const callbackHandled = async (): Promise<void> => {
      this.consoleLogger.log(messageExecuteStarted, CronService.name);

      try {
        await callback();
      } catch (error) {
        const message = [error.constructor.name, error.stack].join('\n');
        this.consoleLogger.error(message, CronService.name);
      }

      this.consoleLogger.log(messageExecuteFinished, CronService.name);
    };

    const job = new CronJob(cronTime, callbackHandled);

    this.schedulerRegistry.addCronJob(name, job);
    job.start();

    this.consoleLogger.log(messageAdd, CronService.name);
  }
}
