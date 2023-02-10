import { create } from "zustand";
import { generateDefaultInput } from "../../common/generateDefaultInput";
import { reducer } from "../../components/Context/mainReducer";
import { defaultCurrency } from "../../config";

const DEFAULT_INPUT = generateDefaultInput({});

export const useAppState = create((set) => ({
  input: DEFAULT_INPUT,
  chart: {},
  rawMarketData: {},
  availableTokens: [],
  settings: {
    currency: defaultCurrency,
    darkMode: false,
  },
  canProceed: null,
  currentCoin: null,
  dispatch: (args) => set((state) => reducer(state, args)),
}));
