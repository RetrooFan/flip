import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { parse } from 'url';
import { RedisModule } from '../../../../../shared/src/modules/redis/redis.module';
import { RedisService } from '../../../../../shared/src/modules/redis/redis.service';
import { ExperimentalService } from './experimental.service';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [RedisModule],
      inject: [RedisService],
      useFactory: (redisService: RedisService) => {
        const redisUrl = redisService.getRedisUrl();
        const redisUrlParsed = parse(redisUrl);
        const redis = {
          port: Number(redisUrlParsed.port),
          host: redisUrlParsed.hostname,
          password: redisUrlParsed.auth.split(':')[1],
          tls: {
            rejectUnauthorized: false,
          },
        };

        return { redis };
      },
    }),
    BullModule.registerQueueAsync({
      name: ExperimentalService.name,
      imports: [RedisModule],
      inject: [RedisService],
      useFactory: (redisService: RedisService) => redisService.redisRegisterQueueFactory(),
    }),
  ],
  providers: [ExperimentalService],
})
export class ExperimentalModule {}
