import registerUser, { IErrorMessage, IUser } from "../../../lib/user/register";

export const errorOccured = (message: IErrorMessage | IUser): message is IErrorMessage => {
  return Boolean((message as IErrorMessage).errorMessage);
}