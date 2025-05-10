import { Injectable } from '@nestjs/common';

@Injectable()
export class HelloService {
  getHello(): string {
    return `Hello ${process.env.npm_package_name}!`;
  }
}
