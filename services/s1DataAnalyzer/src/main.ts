import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { FlipExceptionFilter } from '../../../shared/src/exceptionFilters/flipException.filter';
import { loggerMiddleware } from '../../../shared/src/middlewares/logger.middleware';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  console.log(`Container name: ${process.env.npm_package_name}`);

  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);
  const port = configService.get<number>('port');

  app.use(loggerMiddleware);
  app.useGlobalFilters(new FlipExceptionFilter(app));

  await app.listen(port);

  console.log();
}

bootstrap();
