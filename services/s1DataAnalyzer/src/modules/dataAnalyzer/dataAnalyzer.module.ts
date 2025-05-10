import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductMetric, productMetricSchema } from '../../../../../shared/src/entities/productMetric.entity';
import { DbConnection } from '../../../../../shared/src/enums/dbConnection.enum';
import { CronModule } from '../../../../../shared/src/modules/cron/cron.module';
import { DataAnalyzerService } from './dataAnalyzer.service';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.MONGODB_URI_FLIP,
      }),
      connectionName: DbConnection.DataAnalyzer,
    }),
    MongooseModule.forFeature(
      [
        {
          name: ProductMetric.name,
          schema: productMetricSchema,
        },
      ],
      DbConnection.DataAnalyzer,
    ),
    CronModule,
  ],
  providers: [DataAnalyzerService],
})
export class DataAnalyzerModule {}
