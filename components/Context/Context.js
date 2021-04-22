import { createContext, useContext, useState } from "react";
import { useRouter } from "next/router";
import { useMainReducer } from "./mainReducer";

const AppContext = createContext();

export function AppWrapper({ children }) {
  const [state, dispatch] = useMainReducer();

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
