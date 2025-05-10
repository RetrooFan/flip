import { Module } from '@nestjs/common';
import { HelloModule } from './helloModule/hello.module';

@Module({
  imports: [HelloModule]
})
export class AppModule {}
