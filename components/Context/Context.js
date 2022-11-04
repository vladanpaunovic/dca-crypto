import { createContext, useContext } from "react";
import { useMainReducer } from "./mainReducer";

const AppContext = createContext();

export function AppContextProvider({
  children,
  availableTokens,
  chart,
  currentCoin,
}) {
  const [state, dispatch] = useMainReducer({
    availableTokens,
    chart,
    currentCoin,
  });

  const initialState = {
    state,
    dispatch,
  };

  return (
    <AppContext.Provider value={initialState}>{children}</AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
