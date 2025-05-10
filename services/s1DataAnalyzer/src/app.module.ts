import { Module } from '@nestjs/common';
import { HelloModule } from '../../../shared/src/modules/hello/hello.module';

@Module({
  imports: [HelloModule],
})
export class AppModule {}
