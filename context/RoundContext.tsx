import { createContext, useContext, useReducer } from "react";
import type { ReactNode } from "react";
import { defaultClubs } from "../lib/selectOptions";
import { IShotDetail } from "../utils/roundFormatter";

// add clubs selection to context
// FW hit, gir, putts - add these for stat calculations
// change distance to feet when putter is selected (Make sure change is recognizable)
// -------------
// add extra fields to hole details? - lie, wind direction, uphill/downhill

interface IRoundState {
  clubs: string[];
  holeScores: number[];
  holeShotDetails: IShotDetail[][];
}

const defualtState: IRoundState = {
  clubs: defaultClubs.slice(0, 14),
  holeScores: [],
  holeShotDetails: [],
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
    case "update scores and shot details":
      return {
        ...state,
        holeScore: payload.holeScores,
        holeShotDetails: payload.holeShotDetails,
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
