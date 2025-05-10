import { ConsoleLogger, Injectable, Optional } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { Axios, AxiosRequestConfig } from 'axios';
import { FlipKnownError } from '../../errors/flipKnown.error';

@Injectable()
export class AxiosService {
  private axios: Axios;

  constructor(
    private readonly consoleLogger: ConsoleLogger,
    private readonly configService: ConfigService,
    @Optional() axiosInstance: Axios,
  ) {
    if (axiosInstance && this.configService.get<string>('nodeEnv') === 'test') {
      this.axios = axiosInstance;
    } else {
      this.axios = axios;
    }
  }

  getAxios(): Axios {
    return this.axios;
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
