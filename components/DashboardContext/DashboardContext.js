import { createContext, useContext } from "react";
import useDashboardReducer, { ACTIONS } from "./dashboardReducer";

const DashboardContext = createContext();

export function DashboardContextProvider({ children }) {
  const [state, dispatch] = useDashboardReducer();

  const initialState = {
    state,
    dispatch,
  };

  return (
    <DashboardContext.Provider value={initialState}>
      {children}
    </DashboardContext.Provider>
  );
}

export const DASHBOARD_ACTIONS = ACTIONS;

export const useDashboardContext = () => useContext(DashboardContext);
