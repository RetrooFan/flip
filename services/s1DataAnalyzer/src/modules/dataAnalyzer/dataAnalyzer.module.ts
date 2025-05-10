import { Module } from '@nestjs/common';
import { DataAnalyzerService } from './dataAnalyzer.service';

@Module({
  providers: [DataAnalyzerService],
})
export class DataAnalyzerModule {}
