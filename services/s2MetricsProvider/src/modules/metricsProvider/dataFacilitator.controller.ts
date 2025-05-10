import { Controller, Get } from '@nestjs/common';
import { MetricsProviderService } from './metricsProvider.service';

@Controller()
export class MetricsProviderController {
  constructor(private readonly metricsProviderService: MetricsProviderService) {}

  @Get('top10SalesValue')
  private async top10SalesValue(): Promise<void> {
    this.metricsProviderService;
  }

  @Get('top10OrderCount')
  private async top10OrderCount(): Promise<void> {
    this.metricsProviderService;
  }

  @Get('top10OrderCountYesterday')
  private async top10OrderCountYesterday(): Promise<void> {
    this.metricsProviderService;
  }
}
