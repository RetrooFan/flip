import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { GetOrdersQueryDto } from './dtos/getOrdersQueryDto';
import { DataFacilitatorService } from './dataFacilitator.service';
import { Order } from '../../../../../shared/src/entities/order.entity';
import { errorRethrower } from '../../../../../shared/src/utils';
import { S0DataProviderUnknownError } from '../../errors/s0DataProvider.error';
import { SetDateTimeQueryDto } from './dtos/setDateTimeQueryDto';

@Controller()
export class DataFacilitatorController {
  constructor(private readonly dataFacilitatorService: DataFacilitatorService) {}

  @Get('orders')
  private async gerOrders(
    @Query('_page', ParseIntPipe) _page: number,
    @Query('_limit', ParseIntPipe) _limit: number,
  ): Promise<Order[]> {
    const getOrdersQueryDto: GetOrdersQueryDto = { _page, _limit };

    return await errorRethrower(this.dataFacilitatorService.getOrders(getOrdersQueryDto), S0DataProviderUnknownError);
  }

  @Get('setDateTime')
  private async setDateTime(@Query('date') date: string, @Query('time') time: string): Promise<string> {
    const setDateTimeQueryDto: SetDateTimeQueryDto = { date, time };

    return await errorRethrower(
      this.dataFacilitatorService.setDateTime(setDateTimeQueryDto),
      S0DataProviderUnknownError,
    );
  }
}
