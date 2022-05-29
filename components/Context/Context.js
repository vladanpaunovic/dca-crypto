import { createContext, useContext } from "react";
import { useMainReducer } from "./mainReducer";

const AppContext = createContext();

export function AppContextProvider({
  children,
  availableTokens,
  chartData,
  currentCoin,
}) {
  const [state, dispatch] = useMainReducer({
    availableTokens,
    chartData,
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
