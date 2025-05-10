import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { orderSchema, orderToken } from '../../../../../shared/src/entities/order.entity';
import { DbConnection } from '../../../../../shared/src/enums/dbConnection.enum';
import { DataFetcherController } from './dataFetcher.controller';
import { DataFetcherService } from './dataFetcher.service';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.MONGODB_URI_FLIP,
      }),
      connectionName: DbConnection.DataFetcher,
    }),
    MongooseModule.forFeature(
      [
        {
          name: orderToken,
          schema: orderSchema,
        },
      ],
      DbConnection.DataFetcher,
    ),
  ],
  controllers: [DataFetcherController],
  providers: [DataFetcherService],
})
export class DataFetcherModule {}
