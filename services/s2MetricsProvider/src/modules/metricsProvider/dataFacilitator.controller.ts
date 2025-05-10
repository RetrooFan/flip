import { Controller, Get } from '@nestjs/common';
import { Product } from '../../../../../shared/src/classes/product.class';
import { MetricsProviderService } from './metricsProvider.service';

@Controller()
export class MetricsProviderController {
  constructor(private readonly metricsProviderService: MetricsProviderService) {}

  @Get('top10SalesValue')
  private async top10SalesValue(): Promise<Product[]> {
    this.metricsProviderService;

    return [];
  }

  @Get('top10OrderCount')
  private async top10OrderCount(): Promise<Product[]> {
    this.metricsProviderService;

    return [];
  }

  @Get('top10OrderCountYesterday')
  private async top10OrderCountYesterday(): Promise<Product[]> {
    this.metricsProviderService;

    return [];
  }
}
