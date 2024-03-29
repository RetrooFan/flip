import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { FlipExceptionFilter } from '../../../shared/src/exceptionFilters/flipException.filter';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  console.log(`\nPackage name: ${process.env.npm_package_name}`);

  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);
  const port = configService.get<number>('port');

  app.useGlobalFilters(new FlipExceptionFilter(app));

  await app.listen(port);

  console.log();
}

bootstrap();
