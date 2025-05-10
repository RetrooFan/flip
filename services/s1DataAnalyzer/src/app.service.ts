import { Injectable } from '@nestjs/common';

@Injectable()
export default class AppService {
  private message = 'Hello World!';

  getHello(): string {
    return this.message;
  }
}
