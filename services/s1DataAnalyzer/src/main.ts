import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { FlipExceptionFilter } from '../../../shared/src/exceptionFilters/flipException.filter';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new FlipExceptionFilter(app));
  const configService = app.get<ConfigService>(ConfigService);
  const port = configService.get<number>('port');
  await app.listen(port);
}

bootstrap();
