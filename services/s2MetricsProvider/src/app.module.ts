import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HelloModule } from '../../../shared/src/modules/hello/hello.module';
import configuration from './configuration';
import { MetricsProviderModule } from './modules/metricsProvider/metricsProvider.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, load: [configuration] }), HelloModule, MetricsProviderModule],
})
export class AppModule {}
