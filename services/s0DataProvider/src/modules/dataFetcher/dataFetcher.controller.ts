import { Controller, Get, ParseIntPipe, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { DataFetcherQueryDto } from '../../../../../shared/src/dtos/dataFetcherParams.dto';
import { DataFetcherService } from './dataFetcher.service';

@Controller()
export class DataFetcherController {
  constructor(private readonly dataFetcherService: DataFetcherService) {}

  @Get('load')
  private loadData(
    @Res() response: Response,
    @Query('startPage', ParseIntPipe) startPage: number,
    @Query('endPage', ParseIntPipe) endPage: number,
  ): void {
    const dataFetcherQueryDto: DataFetcherQueryDto = { startPage, endPage };

    this.dataFetcherService.loadData(response, dataFetcherQueryDto);
  }
}
