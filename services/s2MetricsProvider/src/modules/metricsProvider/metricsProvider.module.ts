import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MetricsOfProduct, MetricsOfProductSchema } from '../../../../../shared/src/entities/metricsOfProduct.entity';
import { DbConnection } from '../../../../../shared/src/enums/dbConnection.enum';
import { MetricsProviderController } from './metricsProvider.controller';
import { MetricsProviderService } from './metricsProvider.service';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const uri = configService.get<string>('mongoDbUriFlip');

        return { uri };
      },
      connectionName: DbConnection.MetricsProvider,
    }),
    MongooseModule.forFeature(
      [
        {
          name: MetricsOfProduct.name,
          schema: MetricsOfProductSchema,
        },
      ],
      DbConnection.MetricsProvider,
    ),
  ],
  controllers: [MetricsProviderController],
  providers: [MetricsProviderService],
})
export class MetricsProviderModule {}
