import { Injectable } from '@nestjs/common';

@Injectable()
export class DataFetcherService {
  public loadData(): string {
    return 'Data loading started!';
  }
}
