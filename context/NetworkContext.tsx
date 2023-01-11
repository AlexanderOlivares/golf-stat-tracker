import { createContext, useContext, useReducer } from "react";
import type { ReactNode } from "react";

export interface INetworkState {
  hasNetworkConnection: boolean;
  offlineModeEnabled: boolean;
  mbps: number;
}

const defaultNetworkState: INetworkState = {
  hasNetworkConnection: true,
  offlineModeEnabled: false,
  mbps: 50, // arbitrary
};
export type NetworkAction = {
  type: string;
  payload: INetworkState;
};

type Dispatch = (action: NetworkAction) => void;

interface INetworkContext {
  state: INetworkState;
  dispatch: Dispatch;
}

const NetworkContext = createContext<INetworkContext | undefined>(undefined);

function networkContextReducer(state: INetworkState, action: NetworkAction): any {
  const { type, payload } = action;
  switch (type) {
    case "update network connection status":
      return {
        ...state,
        hasNetworkConnection: payload.hasNetworkConnection,
      };
    case "update offline mode enabled":
      return {
        ...state,
        offlineModeEnabled: payload.offlineModeEnabled,
      };
    case "update mbps":
      return {
        ...state,
        mbps: payload.mbps,
      };
    case "update mbps and offline mode enabled":
      return {
        ...state,
        offlineModeEnabled: payload.offlineModeEnabled,
        mbps: payload.mbps,
      };
    default:
      return state;
  }
}

export function NetworkContextProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(networkContextReducer, defaultNetworkState);
  //   console.log("NETWORK CONTEXT");
  //   console.log(state);

  return <NetworkContext.Provider value={{ state, dispatch }}>{children}</NetworkContext.Provider>;
}

export function useNetworkContext() {
  const context = useContext(NetworkContext);
  if (!context) throw new Error("no network context found");
  return context;
}
