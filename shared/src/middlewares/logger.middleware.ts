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
      url: req.baseUrl,
      headers: req.headers,
      params: req.params,
      query: req.query,
      body: req.body,
      ip: req.ip,
    };

    this.consoleLogger.log(`Incoming request: ${this.counter++}`, request, LoggerMiddleware.name);

    next();
  }
}
