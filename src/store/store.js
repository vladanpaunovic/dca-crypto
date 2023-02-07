import { create } from "zustand";
import { generateDefaultInput } from "../../common/generateDefaultInput";
import { reducer } from "../../components/Context/mainReducer";

const DEFAULT_INPUT = generateDefaultInput({});

const initialState = {
  input: DEFAULT_INPUT,
  chart: {},
  settings: {
    currency: "usd",
    darkMode: false,
    availableTokens: [],
  },
  currentCoin: null,
  dispatch: (args) => set((state) => reducer(state, args)),
};

export const useAppState = create((set) => initialState);
