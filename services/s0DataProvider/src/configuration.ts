import { ConfigObject } from '@nestjs/config';

export default (): ConfigObject => {
  return {
    nodeEnv: process.env.NODE_ENV,
    port: parseInt(process.env.PORT as string, 10) || 80,
    dataSourceApi: process.env.DATA_SOURCE_API,
    itemsNumberQueryLimit: process.env.ITEMS_NUMBER_QUERY_LIMIT,
    mongoDbUriFlip: process.env.MONGODB_URI_FLIP,
  };
};
