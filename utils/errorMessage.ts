export interface IErrorMessage {
  errorMessage: string;
}

export const errorMessage = (errorMessage: string): IErrorMessage => {
  return { errorMessage };
};

export function parseErrorMessage(error: unknown) {
    if (error instanceof Error) return error.message
    return String(error)
  }