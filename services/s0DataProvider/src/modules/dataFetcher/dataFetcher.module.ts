import { ConsoleLogger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, orderSchema } from '../../../../../shared/src/entities/order.entity';
import { DbConnection } from '../../../../../shared/src/enums/dbConnection.enum';
import { AxiosModule } from '../../../../../shared/src/modules/axios/axios.module';
import { DataFetcherController } from './dataFetcher.controller';
import { DataFetcherService } from './dataFetcher.service';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const uri = configService.get<string>('mongoDbUriFlip');

        return { uri };
      },
      connectionName: DbConnection.DataFetcher,
    }),
    MongooseModule.forFeature(
      [
        {
          name: Order.name,
          schema: orderSchema,
        },
      ],
      DbConnection.DataFetcher,
    ),
    AxiosModule,
  ],
  controllers: [DataFetcherController],
  providers: [DataFetcherService, ConsoleLogger],
})
export class DataFetcherModule {}
