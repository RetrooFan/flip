import { ConsoleLogger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AmountOfAnalyzedOrders,
  amountOfAnalyzedOrdersSchema,
} from '../../../../../shared/src/entities/amountOfOrders.entity';
import { MetricsOfProduct, MetricsOfProductSchema } from '../../../../../shared/src/entities/metricsOfProduct.entity';
import { DateOfOrderCounts, dateOfOrderCountsSchema } from '../../../../../shared/src/entities/orderCountDate.entity';
import { DbConnection } from '../../../../../shared/src/enums/dbConnection.enum';
import { AxiosModule } from '../../../../../shared/src/modules/axios/axios.module';
import { CronModule } from '../../../../../shared/src/modules/cron/cron.module';
import { DataAnalyzerService } from './dataAnalyzer.service';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const uri = configService.get<string>('mongoDbUriFlip');
        return { uri };
      },
      connectionName: DbConnection.DataAnalyzer,
    }),
    MongooseModule.forFeature(
      [
        {
          name: AmountOfAnalyzedOrders.name,
          schema: amountOfAnalyzedOrdersSchema,
        },
        {
          name: MetricsOfProduct.name,
          schema: MetricsOfProductSchema,
        },
        {
          name: DateOfOrderCounts.name,
          schema: dateOfOrderCountsSchema,
        },
      ],
      DbConnection.DataAnalyzer,
    ),
    CronModule,
    AxiosModule,
  ],
  providers: [DataAnalyzerService, ConsoleLogger],
})
export class DataAnalyzerModule {}
