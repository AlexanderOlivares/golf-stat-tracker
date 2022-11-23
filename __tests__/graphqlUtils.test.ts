import { errorOccured } from "../pages/api/graphql/graphqlUtils";
import { IUser } from "../lib/user/register";
import { IErrorMessage } from "../utils/errorMessage";

test("If type IUser don't throw error", () => {
  const user: IUser = {
    userid: "df1caec8-ea7c-4cf2-9d77-cd26a4bcc6eb",
    username: "username62",
    email: "user62@aol.com",
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkZjFjYWVjOC1lYTdjLTRjZjItOWQ3Ny1jZDI2YTRiY2M2ZWIiLCJ1c2VyTmFtZSI6InVzZXJuYW1lNjIiLCJlbWFpbCI6InVzZXI2MkBhb2wuY29tIiwiZXhwIjoxNjY0NTk5MjczfQ.WYZh5x8dW2V3EbQPwf7MpCwLWPszF_vMfD-p7Qd8TUU",
  };
  expect(errorOccured(user)).toEqual(false);
});

test("If type other than IErrorMessage don't throw error", () => {
  expect(errorOccured("hi")).toEqual(false);
  expect(errorOccured(null)).toEqual(false);
  expect(errorOccured(undefined)).toEqual(false);
  expect(errorOccured(12)).toEqual(false);
  expect(errorOccured(["arr"])).toEqual(false);
  expect(errorOccured({message: "non-error message"})).toEqual(false);
});


test("If type IErrorMessage then throw error", () => {
  const errorMessage: IErrorMessage = { errorMessage: "error occured"};
  expect(errorOccured(errorMessage)).toEqual(true);
  expect(errorOccured({ errorMessage: "object literal errorMessage"})).toEqual(true);
});

