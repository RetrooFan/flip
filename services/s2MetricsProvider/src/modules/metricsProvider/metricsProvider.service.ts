import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MetricsOfProduct, MetricsOfProductDocument } from '../../../../../shared/src/entities/metricsOfProduct.entity';
import { DbConnection } from '../../../../../shared/src/enums/dbConnection.enum';

@Injectable()
export class MetricsProviderService {
  constructor(
    @InjectModel(MetricsOfProduct.name, DbConnection.DataAnalyzer)
    private readonly metricsOfProductModel: Model<MetricsOfProductDocument>,
  ) {}

  public async top10SalesValue(): Promise<void> {
    this.metricsOfProductModel;
  }

  public async top10OrderCount(): Promise<void> {
    this.metricsOfProductModel;
  }

  public async top10OrderCountYesterday(): Promise<void> {
    this.metricsOfProductModel;
  }
}
