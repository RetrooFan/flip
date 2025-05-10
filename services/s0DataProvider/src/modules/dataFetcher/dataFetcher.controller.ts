import { Controller, Get } from '@nestjs/common';
import { DataFetcherService } from './dataFetcher.service';

@Controller()
export class DataFetcherController {
  constructor(private readonly dataFetcherService: DataFetcherService) {}

  @Get('load')
  private loadData(): string {
    return this.dataFetcherService.loadData();
  }
}
