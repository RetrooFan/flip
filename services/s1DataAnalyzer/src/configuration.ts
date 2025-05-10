import { ConfigObject } from '@nestjs/config';

export default (): ConfigObject => {
  return {
    nodeEnv: process.env.NODE_ENV,
    packageName: process.env.npm_package_name,
    port: parseInt(process.env.PORT),
    dataAnalyzerCronTime: process.env.DATA_ANALYZER_CRON_TIME,
    dataSourceApi: process.env.DATA_SOURCE_API.replace('?????', process.env.NODE_ENV),
    itemsNumberQueryLimit: parseInt(process.env.ITEMS_NUMBER_QUERY_LIMIT),
    mongoDbUriFlip: process.env.MONGODB_URI_FLIP.replace('?????', process.env.NODE_ENV),
    productYesterdayCounterTime: process.env.PRODUCT_YESTERDAY_COUNTER_TIME,
    redisUrl: process.env.REDIS_URL.replace('?????', process.env.NODE_ENV),
  };
};
