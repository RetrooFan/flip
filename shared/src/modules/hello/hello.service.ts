import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HelloService {
  constructor(private readonly configService: ConfigService) {}

  public getHello(): string {
    return `Hello! It's ${this.configService.get<string>('packageName')}!`;
  }
}
