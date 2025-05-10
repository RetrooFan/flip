import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { DataFacilitatorQueryDto } from './dtos/dataFacilitatorQuery.dto';
import { DataFacilitatorService } from './dataFacilitator.service';
import { Order } from '../../../../../shared/src/entities/order.entity';
import { errorRethrower } from '../../../../../shared/src/utils';
import { S0DataProviderError } from '../../errors/s0DataProvider.error';

@Controller()
export class DataFacilitatorController {
  constructor(private readonly dataFacilitatorService: DataFacilitatorService) {}

  @Get('orders')
  private async gerOrders(
    @Query('_page', ParseIntPipe) _page: number,
    @Query('_limit', ParseIntPipe) _limit: number,
  ): Promise<Order[]> {
    const dataFacilitatorQueryDto: DataFacilitatorQueryDto = { _page, _limit };

    return await errorRethrower(this.dataFacilitatorService.getOrders(dataFacilitatorQueryDto), S0DataProviderError);
  }
}
