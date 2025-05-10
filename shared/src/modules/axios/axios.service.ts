import { Injectable } from '@nestjs/common';
import axios, { AxiosStatic } from 'axios';

@Injectable()
export default class AxiosService {
  private readonly axiosInstance: AxiosStatic;

  constructor() {
    this.axiosInstance = axios;
  }

  getAxios(): AxiosStatic {
    return this.axiosInstance;
  }
}
