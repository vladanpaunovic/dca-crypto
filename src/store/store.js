import { create } from "zustand";
import { generateDefaultInput } from "../../common/generateDefaultInput";
import { reducer } from "../../components/Context/mainReducer";
import { defaultCurrency } from "../../config";

export const useStore = create((set) => ({
  input: generateDefaultInput({}),
  chart: null,
  currentCoin: null,
  availableTokens: [],
  settings: {
    currency: defaultCurrency,
  },
  dispatch: (args) => set((state) => reducer(state, args)),
}));
