import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HelloModule } from '../../../shared/src/modules/hello/hello.module';
import { DataAnalyzerModule } from './modules/dataAnalyzer.module';

@Module({
  imports: [ConfigModule.forRoot(), HelloModule, DataAnalyzerModule],
})
export class AppModule {}
