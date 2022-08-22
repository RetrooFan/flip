import { ConsoleLogger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DataFacilitatorModule } from './modules/dataFacilitator/dataFacilitator.module';
import { DataFetcherModule } from './modules/dataFetcher/dataFetcher.module';
import { HelloModule } from '../../../shared/src/modules/hello/hello.module';
import configuration from './configuration';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    HelloModule,
    DataFetcherModule,
    DataFacilitatorModule,
  ],
  providers: [ConsoleLogger],
})
export class AppModule {}
