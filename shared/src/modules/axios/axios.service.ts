import { ConsoleLogger, Injectable } from '@nestjs/common';
import axios, { AxiosRequestConfig, AxiosStatic } from 'axios';
import { FlipKnownError } from '../../errors/flipKnown.error';

@Injectable()
export class AxiosService {
  private readonly axiosInstance: AxiosStatic;

  constructor(private readonly consoleLogger: ConsoleLogger) {
    this.axiosInstance = axios;
  }

  getAxios(): AxiosStatic {
    return this.axiosInstance;
  }

  public async request<T = unknown>(options: AxiosRequestConfig): Promise<T> {
    const startTime = Date.now();

    try {
      const result = await this.getAxios().request<T>(options);
      const duration = Date.now() - startTime;

      this.consoleLogger.log(
        `Outgoing request: ${result.status} ${result.statusText} - ${duration} ms`,
        AxiosService.name,
      );
      this.consoleLogger.log(
        'Request options',
        options,
        `Response content length: ${result.headers['content-length']}`,
        AxiosService.name,
      );

      return result.data;
    } catch (error) {
      const duration = Date.now() - startTime;
      const { response } = error;

      this.consoleLogger.error(
        `${error.constructor.name} - Outgoing request: ${error.code} ${response?.data.statusCode} - ${duration} ms`,
        AxiosService.name,
      );
      this.consoleLogger.error(
        'Request options',
        options,
        `Response content length: ${response?.headers['content-length']}`,
        'Response data',
        response?.data,
        AxiosService.name,
      );

      throw new FlipKnownError({ message: error.message, original: error });
    }
  }
}
