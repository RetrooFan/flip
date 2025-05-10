import { Controller, Get, HttpStatus, ParseIntPipe, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { DataFetcherQueryDto } from './dtos/dataFetcherQuery.dto';
import { Order } from '../../../../../shared/src/entities/order.entity';
import { DataFetcherService } from './dataFetcher.service';

@Controller()
export class DataFetcherController {
  constructor(private readonly dataFetcherService: DataFetcherService) {}

  @Get('load')
  private async loadData(
    @Res() response: Response,
    @Query('startPage', ParseIntPipe) startPage: number,
    @Query('endPage', ParseIntPipe) endPage: number,
  ): Promise<void> {
    const dataFetcherQueryDto: DataFetcherQueryDto = { startPage, endPage };

    response.status(HttpStatus.OK).send('Data loading started!');

    await this.dataFetcherService.loadData(dataFetcherQueryDto);
  }

  @Get('stop')
  private stopLoading(): string {
    return this.dataFetcherService.stopLoading();
  }

  @Get('abort')
  private abortLoading(): string {
    return this.dataFetcherService.abortLoading();
  }

  @Get('read')
  private async read(): Promise<Order[]> {
    return await this.dataFetcherService.read();
  }
}
