import { createContext, useContext, useReducer } from "react";
import type { ReactNode } from "react";
import { JWTPayload } from "jose";

interface ITokenPayload {
  userid: string;
  username: string;
  email: string;
  exp: number;
}

export interface IAuthState {
  isAuth: boolean;
  tokenPayload: ITokenPayload | null;
}

const defualtState: IAuthState = {
  isAuth: false,
  tokenPayload: null,
};

export type AuthAction = {
  type: string;
  payload: IAuthState;
};

type Dispatch = (action: AuthAction) => void;

interface IAuthContext {
  state: IAuthState;
  dispatch: Dispatch;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

function authContextReducer(state: IAuthState, action: AuthAction): any {
  const { type, payload } = action;
  switch (type) {
    case "update auth status":
      return {
        isAuth: payload.isAuth,
        tokenPayload: payload.tokenPayload,
      };
    default:
      return state;
  }
}

export function AuthContextProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authContextReducer, defualtState);
  console.log("in auth context provier");
  console.log(state);

  return <AuthContext.Provider value={{ state, dispatch }}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("no auth context found");
  return context;
}
