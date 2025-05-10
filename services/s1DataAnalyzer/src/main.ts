import { NestFactory } from '@nestjs/core';
import { FlipExceptionFilter } from '../../../shared/src/exceptionFilters/flipException.filter';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new FlipExceptionFilter(app));
  await app.listen(process.env.PORT);
}

bootstrap();
