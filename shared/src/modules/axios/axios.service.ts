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

      this.consoleLogger.log(`${result.status} ${result.statusText} - ${duration} ms`, AxiosService.name);
      this.consoleLogger.log(options, AxiosService.name);

      return result.data;
    } catch (error) {
      const duration = Date.now() - startTime;

      this.consoleLogger.error(error.constructor.name, AxiosService.name);
      this.consoleLogger.error(`${error.response.data.statusCode} ${error.code} - ${duration} ms`, AxiosService.name);
      this.consoleLogger.error(options, AxiosService.name);
      this.consoleLogger.error(error.response.data, AxiosService.name);

      throw new FlipKnownError({ message: error.message, original: error });
    }
  }
}
