import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { FlipError } from '../errors/flip.error';

@Catch(FlipError)
export class GlobalExceptionFilter implements ExceptionFilter {
  // eslint-disable-next-line class-methods-use-this
  catch(error: Error, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(500).json({
      statusCode: 500,
      message: 'Internal server error',
      details: error.message,
    });
  }
}
