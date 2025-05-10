import { Injectable } from '@nestjs/common';
import Redis, { RedisOptions } from 'ioredis';
import { BullModuleOptions } from '@nestjs/bull';

@Injectable()
export class RedisService {
  private readonly redisUrl: string;
  private readonly redisQueueClient: Redis;
  private readonly redisQueueSubscriber: Redis;

  constructor() {
    this.redisUrl = `${process.env.REDIS_URL}-${process.env.NODE_ENV}-redis:${process.env.REDIS_PORT}`;
    this.redisQueueClient = new Redis(this.redisUrl, getRedisConnectionConfig());
    this.redisQueueSubscriber = new Redis(this.redisUrl, getRedisConnectionConfig());
  }

  public redisRegisterQueueFactory(): BullModuleOptions {
    return {
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: true,
      },
      createClient: (type) => this.getRedisQueue(type),
    };
  }

  public getRedisUrl(): string {
    return this.redisUrl;
  }

  private getRedisQueue(type: string): Redis {
    switch (type) {
      case 'client':
        return this.redisQueueClient;
      case 'subscriber':
        return this.redisQueueSubscriber;
      default:
        return new Redis(this.redisUrl, getRedisConnectionConfig());
    }
  }
}

function getRedisConnectionConfig(): RedisOptions {
  const redisConfig = {
    tls: {
      rejectUnauthorized: false,
    },
  };

  return redisConfig;
}
