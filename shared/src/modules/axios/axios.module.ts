import { ConsoleLogger, Module } from '@nestjs/common';
import { AxiosService } from './axios.service';

@Module({
  providers: [AxiosService, ConsoleLogger],
  exports: [AxiosService],
})
export class AxiosModule {}
