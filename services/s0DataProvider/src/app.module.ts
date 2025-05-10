import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DataFacilitatorModule } from './dataFacilitator/dataFacilitator.module';
import { DataFetcherModule } from './dataFetcher/dataFetcher.module';
import { HelloModule } from './helloModule/hello.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), HelloModule, DataFetcherModule, DataFacilitatorModule],
})
export class AppModule {}
