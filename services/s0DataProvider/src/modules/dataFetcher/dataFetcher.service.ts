import { Injectable } from '@nestjs/common';

@Injectable()
export class DataFetcherService {
  public loadData(): string {
    return 'Data loading started!';
  }

  private async findNumberOfItems(): Promise<number> {
    let data: unknown[] = [{}];
    let page = 150;
    let previousPage = 150;
    let delta = 10;
    const limit = 100;

    while (1) {
      const params = { _page: page, _limit: limit };

      ({ data } = await this.axiosInstance.get('orders', {
        params,
        baseURL: process.env.DATA_SOURCE_API,
      }));

      console.log('page', page);
      console.log('data.length', data.length);

      if (data.length === limit) {
        previousPage = page;
        page += delta;
      } else if (data.length) {
        const itemsNumber = (page - 1) * limit + data.length;

        console.log(itemsNumber);

        return itemsNumber;
      } else {
        delta = Math.trunc(delta / 2);
        page = previousPage + delta;
      }
    }
  }
}
