import { errorOccured } from "../pages/api/graphql/graphqlUtils";
import { IErrorMessage, IUser } from "../lib/user/register";

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


test("If type IErrorMessage then throw error", () => {
  const errorMessage: IErrorMessage = { errorMessage: "eroror occured"};
  expect(errorOccured(errorMessage)).toEqual(true);
});

