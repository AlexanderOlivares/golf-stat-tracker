import { createContext, useContext, useReducer } from "react";
import type { ReactNode } from "react";
import { defaultClubs } from "../lib/selectOptions";
import { createHoleDetailsJson, IShotDetail } from "../utils/roundFormatter";

export interface IRoundState {
  clubs: string[];
  holeScores: number[];
  isUserAddedCourse: boolean;
  holeShotDetails: IShotDetail[][];
  par: string[];
  lastSaveTimestamp: number;
}

const defualtState: IRoundState = {
  clubs: defaultClubs.slice(0, 14),
  holeScores: [],
  isUserAddedCourse: false,
  holeShotDetails: createHoleDetailsJson(),
  par: [],
  lastSaveTimestamp: Date.now(),
};

export type Action = {
  type: string;
  payload: IRoundState;
};
export type Dispatch = (action: Action) => void;

interface IRoundContext {
  state: IRoundState;
  dispatch: Dispatch;
}

const RoundContext = createContext<IRoundContext | undefined>(undefined);

function roundContextReducer(state: IRoundState, action: Action): any {
  const { type, payload } = action;
  switch (type) {
    case "update clubs":
      return {
        ...state,
        clubs: payload.clubs,
      };
    case "update scores and shot details and timestamp":
      return {
        ...state,
        lastSaveTimestamp: payload.lastSaveTimestamp,
        holeScores: payload.holeScores,
        isUserAddedCourse: payload.isUserAddedCourse,
        holeShotDetails: payload.holeShotDetails,
        par: payload.par,
      };
    case "update hole score":
      return {
        ...state,
        holeScores: payload.holeScores,
      };
    case "update hole shot details":
      return {
        ...state,
        holeShotDetails: payload.holeShotDetails,
      };
    case "set par for user added course":
      return {
        ...state,
        par: payload.par,
      };
    case "update last save timestamp":
      return {
        ...state,
        lastSaveTimestamp: payload.lastSaveTimestamp,
      };
    default:
      return state;
  }
}

export function RoundContextProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(roundContextReducer, defualtState);
  console.log("in round contexxt provier");
  console.log(state);

  return <RoundContext.Provider value={{ state, dispatch }}>{children}</RoundContext.Provider>;
}

export function useRoundContext() {
  const context = useContext(RoundContext);
  if (!context) throw new Error("no round context found");
  return context;
}
