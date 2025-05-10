import { ConsoleLogger, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  public static routes = ['*'];
  private counter = 0;

  constructor(private readonly consoleLogger: ConsoleLogger) {}

  use(req: Request, res: Response, next: NextFunction): void {
    const request = {
      method: req.method,
      url: req.url.split('?')[0],
      query: req.query,
      params: req.params,
      ip: req.ip,
    };

    console.log('Incoming request', this.counter++, request, '\n');

    next();
  }
}
