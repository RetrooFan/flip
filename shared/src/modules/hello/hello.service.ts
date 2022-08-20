import { Injectable } from '@nestjs/common';

@Injectable()
export class HelloService {
  private message = `Hello ${process.env.npm_package_name}!`;

  public getHello(): string {
    return this.message;
  }
}
