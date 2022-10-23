import { JWTPayload } from "jose";
import { Pool } from "pg";
import { IErrorMessage } from "../../../lib/user/register";
import { INewRound } from "../../[username]/round/new-round";

export interface IUserQueryArgs {
  username: string;
}

export interface IRegisterMutationArgs {
  input: {
    username: string;
    email: string;
    password: string;
  };
}

export interface ILoginMutationArgs {
  input: {
    email: string;
    password: string;
  };
}

export interface INewRoundMutationArgs {
  input: INewRound
}

export interface IContext {
  req: Request;
  res: Response;
  pool: Pool;
  token: JWTPayload | IErrorMessage;
}
