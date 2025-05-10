import { ConfigObject } from '@nestjs/config';

export default (): ConfigObject => ({
  nodeEnv: process.env.NODE_ENV,
  packageName: process.env.npm_package_name,
  port: parseInt(process.env.PORT),
  mongoDbUriFlip: process.env.MONGODB_URI_FLIP.replace('?????', process.env.NODE_ENV),
});
