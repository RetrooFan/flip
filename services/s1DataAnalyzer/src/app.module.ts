import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HelloModule } from '../../../shared/src/modules/hello/hello.module';
import configuration from './configuration';
import { DataAnalyzerModule } from './modules/dataAnalyzer/dataAnalyzer.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, load: [configuration] }), HelloModule, DataAnalyzerModule],
})
export class AppModule {}
