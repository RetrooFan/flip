import { Module } from '@nestjs/common';
import { DataFacilitatorModule } from './dataFacilitator/dataFacilitator.module';
import { DataFetcherModule } from './dataFetcher/dataFetcher.module';
import { HelloModule } from './helloModule/hello.module';

@Module({
  imports: [HelloModule, DataFetcherModule, DataFacilitatorModule]
})
export class AppModule {}
