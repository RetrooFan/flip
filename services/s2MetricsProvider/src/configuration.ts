import { ConfigObject } from '@nestjs/config';

export default (): ConfigObject => {
  return {
    mongoDbUriFlip: process.env.MONGODB_URI_FLIP.replace('?????', process.env.NODE_ENV),
  };
};
