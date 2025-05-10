import { Module } from '@nestjs/common';
import { DataAnalyzerService } from './dataAnalyzer.service';

@Module({
  imports: [],
  controllers: [],
  providers: [DataAnalyzerService],
})
export class DataAnalyzerModule {}
