import { Controller, Get, ParseIntPipe, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { LoadDataQueryDto } from './dtos/dataFetcherQuery.dto';
import { Order } from '../../../../../shared/src/entities/order.entity';
import { DataFetcherService } from './dataFetcher.service';
import { S0DataProviderUnknownError } from '../../errors/s0DataProvider.error';
import { errorRethrower } from '../../../../../shared/src/utils';

@Controller()
export class DataFetcherController {
  constructor(private readonly dataFetcherService: DataFetcherService) {}

  @Get('load')
  private async loadData(
    @Res() response: Response,
    @Query('startPage', ParseIntPipe) startPage: number,
    @Query('endPage', ParseIntPipe) endPage: number,
  ): Promise<void> {
    const loadDataQueryDto: LoadDataQueryDto = { startPage, endPage };

    await errorRethrower(this.dataFetcherService.loadData(response, loadDataQueryDto), S0DataProviderUnknownError);
  }

  @Get('stop')
  private async stopLoading(): Promise<string> {
    return await errorRethrower(this.dataFetcherService.stopLoading(), S0DataProviderUnknownError);
  }

  @Get('abort')
  private async abortLoading(): Promise<string> {
    return await errorRethrower(this.dataFetcherService.abortLoading(), S0DataProviderUnknownError);
  }

  @Get('read')
  private async read(): Promise<Order[]> {
    return await errorRethrower(this.dataFetcherService.read(), S0DataProviderUnknownError);
  }
}
