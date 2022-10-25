import { IErrorMessage } from "../../../utils/errorMessage";

export const errorOccured = (message: IErrorMessage | any): message is IErrorMessage => {
  return Boolean((message as IErrorMessage)?.errorMessage);
};
