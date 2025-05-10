import { FlipKnownError } from './errors/flipKnown.error';
import { FlipUnknownError } from './errors/flipUnknown.error';

export async function errorRethrower<T>(
  promise: Promise<T>,
  errorClass: new (message: string) => FlipUnknownError,
): Promise<T> {
  try {
    return await promise;
  } catch (error) {
    if (error instanceof FlipKnownError) {
      throw error;
    } else {
      const errorToThrow = new errorClass(error.message);
      errorToThrow.original = error;

      throw errorToThrow;
    }
  }
}
