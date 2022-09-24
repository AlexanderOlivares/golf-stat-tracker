import { Pool } from "pg";

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

export interface IContext {
  req: Request;
  res: Response;
  pool: Pool;
}
