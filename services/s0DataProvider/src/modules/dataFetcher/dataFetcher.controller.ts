import { Controller, Get, ParseIntPipe, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { DataFetcherQueryDto } from '../../../../../shared/src/dtos/dataFetcherQuery.dto';
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

    await this.dataFetcherService.loadData(response, dataFetcherQueryDto);
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
  private async read(): Promise<string> {
    return await this.dataFetcherService.read();
  }
}
