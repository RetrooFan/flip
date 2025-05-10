import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HelloModule } from '../../../shared/src/modules/hello/hello.module';

@Module({
  imports: [ConfigModule.forRoot(), HelloModule],
})
export class AppModule {}
