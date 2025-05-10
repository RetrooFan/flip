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
    const products: Product[] = [];
    const metricsOfProducts = await this.metricsOfProductModel
      .find<MetricsOfProduct>()
      .limit(10)
      .sort({ salesValue: -1 });

    metricsOfProducts.forEach((metricsOfProduct) => {
      products.push({
        id: metricsOfProduct._id,
        name: metricsOfProduct.name,
        price: metricsOfProduct.price,
        salesValue: metricsOfProduct.salesValue,
      });
    });

    return products;
  }

  public async top10OrderCount(): Promise<Product[]> {
    const products: Product[] = [];
    const metricsOfProducts = await this.metricsOfProductModel
      .find<MetricsOfProduct>()
      .limit(10)
      .sort({ orderCountTotal: -1 });

    metricsOfProducts.forEach((metricsOfProduct) => {
      products.push({
        id: metricsOfProduct._id,
        name: metricsOfProduct.name,
        price: metricsOfProduct.price,
        orderCountTotal: metricsOfProduct.orderCountTotal,
      });
    });

    return products;
  }

  public async top10OrderCountYesterday(): Promise<Product[]> {
    const products: Product[] = [];
    const metricsOfProducts = await this.metricsOfProductModel
      .find<MetricsOfProduct>()
      .limit(10)
      .sort({ orderCountYesterday: -1 });

    metricsOfProducts.forEach((metricsOfProduct) => {
      products.push({
        id: metricsOfProduct._id,
        name: metricsOfProduct.name,
        price: metricsOfProduct.price,
        orderCountYesterday: metricsOfProduct.orderCountYesterday,
      });
    });

    return products;
  }
}
