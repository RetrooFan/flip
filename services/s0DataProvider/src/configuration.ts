import { ConfigObject } from '@nestjs/config';

export default (): ConfigObject => {
  return {
    nodeEnv: process.env.NODE_ENV,
    port: parseInt(process.env.PORT),
    dataSourceApi: process.env.DATA_SOURCE_API,
    itemsNumberQueryLimit: parseInt(process.env.ITEMS_NUMBER_QUERY_LIMIT),
    mongoDbUriFlip: process.env.MONGODB_URI_FLIP.replace('?????', process.env.NODE_ENV),
  };
};
