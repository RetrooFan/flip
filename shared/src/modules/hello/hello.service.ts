import { Injectable } from '@nestjs/common';

@Injectable()
export class HelloService {
  public getHello(): string {
    return `Hello ${process.env.npm_package_name}!`;
  }
}