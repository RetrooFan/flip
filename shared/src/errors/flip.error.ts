export interface IFlipErrorPayload {
  message: string;
  original: Error;
}

export class FlipError extends Error {
  original: Error;

  constructor(flipErrorPayload: IFlipErrorPayload) {
    super(flipErrorPayload.message);
    this.original = flipErrorPayload.original;
  }
}
