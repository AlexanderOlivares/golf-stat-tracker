import { JWTPayload } from "jose";
import { Pool } from "pg";
import { IErrorMessage } from "../../../utils/errorMessage";
import { IRoundRequestBody } from "../../[username]/round/new-round";

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
  input: IRoundRequestBody
}

export interface IContext {
  req: Request;
  res: Response;
  pool: Pool;
  token: JWTPayload | IErrorMessage;
}

export interface IRoundQueryArgs {
  roundid: string;
}

export interface ICourseQueryArgs {
  courseId: string;
  teeColor: string;
}