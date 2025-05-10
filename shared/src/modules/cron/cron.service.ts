import { ConsoleLogger, Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { logError } from '../../utils';

@Injectable()
export class CronService {
  private readonly countersMap: Map<string, number>;

  constructor(private readonly schedulerRegistry: SchedulerRegistry, private readonly consoleLogger: ConsoleLogger) {
    this.countersMap = new Map();
  }

  addJob(name: string, cronTime: string, callback: () => Promise<void>): void {
    const messageAdd = `Cron job ${name} added with [${cronTime}]`;
    const messageExecuteStarted = `Cron job ${name} execution started`;
    const messageExecuteFinished = `Cron job ${name} execution finished`;

    const callbackHandled = async (): Promise<void> => {
      const counter = this.countersMap.get(name);
      this.countersMap.set(name, counter + 1);
      const startTime = Date.now();
      this.consoleLogger.log(`${messageExecuteStarted}: ${counter}`, CronService.name);

      try {
        await callback();
      } catch (error) {
        logError(this.consoleLogger, error, CronService.name);
      }

      const duration = Date.now() - startTime;
      this.consoleLogger.log(`${messageExecuteFinished} in ${duration} ms\n`, CronService.name);
    };

    this.countersMap.set(name, 0);
    const job = new CronJob(cronTime, callbackHandled);
    this.schedulerRegistry.addCronJob(name, job);
    job.start();

    this.consoleLogger.log(messageAdd, CronService.name);
  }
}
