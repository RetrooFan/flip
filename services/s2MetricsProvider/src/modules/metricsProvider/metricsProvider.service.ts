import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from '../../../../../shared/src/classes/product.class';
import { MetricsOfProduct, MetricsOfProductDocument } from '../../../../../shared/src/entities/metricsOfProduct.entity';
import { DbConnection } from '../../../../../shared/src/enums/dbConnection.enum';

@Injectable()
export class MetricsProviderService {
  constructor(
    @InjectModel(MetricsOfProduct.name, DbConnection.DataAnalyzer)
    private readonly metricsOfProductModel: Model<MetricsOfProductDocument>,
  ) {}

  public async top10SalesValue(): Promise<Product[]> {
    this.metricsOfProductModel;

    return [];
  }

  public async top10OrderCount(): Promise<Product[]> {
    this.metricsOfProductModel;

    return [];
  }

  public async top10OrderCountYesterday(): Promise<Product[]> {
    this.metricsOfProductModel;

    return [];
  }
}
