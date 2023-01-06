import { JWTPayload } from "jose";
import { Pool } from "pg";
import { IErrorMessage } from "../../../utils/errorMessage";
import { IShotDetail } from "../../../utils/roundFormatter";
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

export interface IPasswordResetMutationArgs {
  input: {
    email: string;
    password: string;
    token: string;
  };
}

export interface INewRoundMutationArgs {
  input: IRoundRequestBody;
}

export interface IEditClubsMutationArgs {
  input: {
    clubs: string[];
    username: string;
  };
}

export interface IUpdateUserAddedParArgs {
  input: {
    unverifiedCourseId: string;
    userAddedPar: string[];
    username: string;
  };
}

export interface IUpdateRoundArgs {
  input: {
    holeScores: (number | null)[];
    holeShotDetails: IShotDetail[][];
    roundid: string;
    username: string;
  };
}

export interface IDeleteRoundArgs {
    input: {
      roundid: string;
      username: string;
    };
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
  isUserAddedCourse: boolean;
}