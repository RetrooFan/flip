import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import {
  DateOfVisibleOrders,
  dateOfVisibleOrdersSchema,
} from '../../../../../shared/src/entities/dateOfVisibleOrders.entity';
import { Order, orderSchema } from '../../../../../shared/src/entities/order.entity';
import { DbConnection } from '../../../../../shared/src/enums/dbConnection.enum';
import { DataFacilitatorController } from './dataFacilitator.controller';
import { DataFacilitatorService } from './dataFacilitator.service';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const uri = configService.get<string>('mongoDbUriFlip');

        return { uri };
      },
      connectionName: DbConnection.DataFacilitator,
    }),
    MongooseModule.forFeature(
      [
        {
          name: Order.name,
          schema: orderSchema,
        },
        {
          name: DateOfVisibleOrders.name,
          schema: dateOfVisibleOrdersSchema,
        },
      ],
      DbConnection.DataFacilitator,
    ),
  ],
  controllers: [DataFacilitatorController],
  providers: [DataFacilitatorService],
})
export class DataFacilitatorModule {}
