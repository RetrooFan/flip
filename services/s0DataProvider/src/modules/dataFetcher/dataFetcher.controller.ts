import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { DataFetcherService } from './dataFetcher.service';

@Controller()
export class DataFetcherController {
  constructor(private readonly dataFetcherService: DataFetcherService) {}

  @Get('load')
  private loadData(@Res() response: Response): void {
    this.dataFetcherService.loadData(response);
  }
}
