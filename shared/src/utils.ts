import { IFlipErrorPayload } from './errors/flip.error';
import { FlipKnownError } from './errors/flipKnown.error';
import { FlipUnknownError } from './errors/flipUnknown.error';

export async function errorRethrower<T>(
  promise: Promise<T>,
  errorClass: new (flipErrorPayload: IFlipErrorPayload) => FlipUnknownError,
): Promise<T> {
  try {
    return await promise;
  } catch (error) {
    if (error instanceof FlipKnownError) {
      throw error;
    } else {
      throw new errorClass({ message: error.message, original: error });
    }
  }
}
