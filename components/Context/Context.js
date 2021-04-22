import { createContext, useContext, useState } from "react";
import { useRouter } from "next/router";
import { useMainReducer } from "./mainReducer";

const AppContext = createContext();

export function AppWrapper({ children }) {
  const mainReducer = useMainReducer();

  const initialState = {
    state: mainReducer[0],
    dispatch: mainReducer[1],
  };

  return (
    <AppContext.Provider value={initialState}>{children}</AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
