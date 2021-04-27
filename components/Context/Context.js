import { createContext, useContext } from "react";
import { useMainReducer } from "./mainReducer";

const AppContext = createContext();

export function AppContextProvider({ children, availableTokens }) {
  const [state, dispatch] = useMainReducer(availableTokens);

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
