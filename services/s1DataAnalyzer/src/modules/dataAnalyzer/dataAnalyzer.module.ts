import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AmountOfOrders, amountOfOrdersSchema } from '../../../../../shared/src/entities/amountOfOrders.entity';
import { ProductMetric, productMetricSchema } from '../../../../../shared/src/entities/productMetric.entity';
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
          name: ProductMetric.name,
          schema: productMetricSchema,
        },
        {
          name: AmountOfOrders.name,
          schema: amountOfOrdersSchema,
        },
      ],
      DbConnection.DataAnalyzer,
    ),
    CronModule,
    AxiosModule,
  ],
  providers: [DataAnalyzerService],
})
export class DataAnalyzerModule {}
