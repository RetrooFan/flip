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
    try {
      return (await this.getAxios().request<T>(options)).data;
    } catch (error) {
      this.consoleLogger.error(error.constructor.name, AxiosService.name);
      this.consoleLogger.error(error.response.data, AxiosService.name);

      throw new FlipKnownError({ message: error.message, original: error });
    }
  }
}
