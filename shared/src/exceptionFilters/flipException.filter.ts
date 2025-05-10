import { ExceptionFilter, Catch, ArgumentsHost, ConsoleLogger, INestApplication } from '@nestjs/common';
import { Response } from 'express';
import { FlipError } from '../errors/flip.error';
import { FlipUnknownError } from '../errors/flipUnknown.error';
import { logError } from '../utils';

@Catch(FlipError, FlipUnknownError)
export class FlipExceptionFilter implements ExceptionFilter {
  private readonly consoleLogger: ConsoleLogger;

  constructor(app: INestApplication) {
    this.consoleLogger = app.get<ConsoleLogger>(ConsoleLogger);
  }

  // eslint-disable-next-line class-methods-use-this
  catch(error: Error, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    logError(this.consoleLogger, error, FlipExceptionFilter.name);

    if (response.headersSent) {
      return;
    }

    response.status(500).json({
      statusCode: 500,
      message: 'Internal server error',
      details: error.message,
    });
  }
}
