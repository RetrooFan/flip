import { Request, Response, NextFunction } from 'express';

export function logger(req: Request, res: Response, next: NextFunction): void {
  const request = {
    ip: req.ip,
    method: req.method,
    url: req.url.split('?')[0],
    query: req.query,
    params: req.params,
  };

  console.log('Request', request);
  console.log();

  next();
}
