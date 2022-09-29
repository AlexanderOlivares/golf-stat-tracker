import { IErrorMessage } from "../../../lib/user/register";

export const errorOccured = (message: IErrorMessage | any): message is IErrorMessage => {
  return Boolean((message as IErrorMessage)?.errorMessage);
};
