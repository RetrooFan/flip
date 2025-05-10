import { ConfigObject } from '@nestjs/config';

export default (): ConfigObject => {
  return {
    nodeEnv: process.env.NODE_ENV,
    port: parseInt(process.env.PORT as string, 10) || 80,
    dataAnalyzerCronTime: process.env.DATA_ANALYZER_CRON_TIME,
    mongoDbUriFlip: process.env.MONGODB_URI_FLIP,
    productYesterdayCounterTime: process.env.PRODUCT_YESTERDAY_COUNTER_TIME,
    redisUrl: process.env.REDIS_URL,
    redisPort: process.env.REDIS_PORT,
  };
};
