import { Controller, Get } from '@nestjs/common';
import HelloService from './hello.service';

@Controller()
export default class HelloController {
  constructor(private readonly helloService: HelloService) {}

  @Get('hello')
  private getHello(): string {
    return this.helloService.getHello();
  }
}
