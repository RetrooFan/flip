import { NestFactory } from '@nestjs/core';
import { GlobalExceptionFilter } from '../../../shared/src/exceptionFilters/globalException.filter';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new GlobalExceptionFilter());
  await app.listen(process.env.PORT);
}

bootstrap();
