import { FlipError } from './errors/flip.error';

export async function errorRethrower<T>(
  promise: Promise<T>,
  errorClass: new (message: string) => FlipError,
): Promise<T> {
  try {
    return await promise;
  } catch (error) {
    if (error instanceof FlipError) {
      throw error;
    } else {
      throw new errorClass(error.message);
    }
  }
}
