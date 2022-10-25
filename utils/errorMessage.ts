export interface IErrorMessage {
  errorMessage: string;
}

export const errorMessage = (errorMessage: string): IErrorMessage => {
  return { errorMessage };
};