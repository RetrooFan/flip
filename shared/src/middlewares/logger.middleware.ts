import { Request, Response, NextFunction } from 'express';

let counter = 0;

export function logger(req: Request, res: Response, next: NextFunction): void {
  const request = {
    method: req.method,
    url: req.url.split('?')[0],
    query: req.query,
    params: req.params,
    ip: req.ip,
  };

  console.log('Request', counter++, request);
  console.log();

  next();
}
