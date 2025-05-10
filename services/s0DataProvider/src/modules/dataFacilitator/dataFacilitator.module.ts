import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, orderSchema } from '../../../../../shared/src/entities/order.entity';
import { DbConnection } from '../../../../../shared/src/enums/dbConnection.enum';
import { DataFacilitatorController } from './dataFacilitator.controller';
import { DataFacilitatorService } from './dataFacilitator.service';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.MONGODB_URI_FLIP,
      }),
      connectionName: DbConnection.DataFacilitator,
    }),
    MongooseModule.forFeature(
      [
        {
          name: Order.name,
          schema: orderSchema,
        },
      ],
      DbConnection.DataFacilitator,
    ),
  ],
  controllers: [DataFacilitatorController],
  providers: [DataFacilitatorService],
})
export class DataFacilitatorModule {}
