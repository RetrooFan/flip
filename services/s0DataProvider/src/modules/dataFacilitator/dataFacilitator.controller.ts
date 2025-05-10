import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { DataFacilitatorQueryDto } from './dtos/dataFacilitatorQuery.dto';
import { DataFacilitatorService } from './dataFacilitator.service';
import { Order } from '../../../../../shared/src/entities/order.entity';

@Controller()
export class DataFacilitatorController {
  constructor(private readonly dataFacilitatorService: DataFacilitatorService) {}

  @Get('orders')
  private async gerOrders(
    @Query('_page', ParseIntPipe) _page: number,
    @Query('_limit', ParseIntPipe) _limit: number,
  ): Promise<Order[]> {
    const dataFacilitatorQueryDto: DataFacilitatorQueryDto = { _page, _limit };

    const orders = await this.dataFacilitatorService.getOrders(dataFacilitatorQueryDto);

    return orders;
  }
}
