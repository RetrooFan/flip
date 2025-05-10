import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DataFacilitatorModule } from './modules/dataFacilitator/dataFacilitator.module';
import { DataFetcherModule } from './modules/dataFetcher/dataFetcher.module';
import { HelloModule } from './modules/hello/hello.module';

@Module({
  imports: [ConfigModule.forRoot(), HelloModule, DataFetcherModule, DataFacilitatorModule],
})
export class AppModule {}
