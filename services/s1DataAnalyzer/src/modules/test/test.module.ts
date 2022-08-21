import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { parse } from 'url';
import { RedisModule } from '../../../../../shared/src/modules/redis/redis.module';
import { RedisService } from '../../../../../shared/src/modules/redis/redis.service';
import { TestService } from './test.service';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [RedisModule],
      inject: [RedisService],
      useFactory: (redisService: RedisService) => {
        const rawRedisUrl = redisService.getRawRedisUrl();
        const redisUrl = parse(rawRedisUrl);
        const redis = {
          port: Number(redisUrl.port),
          host: redisUrl.hostname,
          password: redisUrl.auth.split(':')[1],
          tls: {
            rejectUnauthorized: false,
          },
        };

        return { redis };
      },
    }),
    BullModule.registerQueueAsync({
      name: TestService.name,
      imports: [RedisModule],
      inject: [RedisService],
      useFactory: (redisService: RedisService) => redisService.redisRegisterQueueFactory(),
    }),
  ],
  providers: [TestService],
})
export class TestModule {}