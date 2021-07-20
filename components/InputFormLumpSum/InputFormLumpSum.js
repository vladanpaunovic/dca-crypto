import { useMutation } from "react-query";
import axios from "axios";
import { useAppContext } from "../Context/Context";
import { useRouter } from "next/router";
import { XIcon, CalculatorIcon } from "@heroicons/react/outline";
import {
  ACTIONS,
  calculateDateRangeDifference,
  useCurrentCoin,
} from "../Context/mainReducer";
import { useEffect, useState } from "react";
import { availableCurrencies } from "../../config";
import Loading from "react-loading";
import * as ga from "../helpers/GoogleAnalytics";
import useEffectOnlyOnUpdate from "../Hooks/useEffectOnlyOnUpdate";
import useGenerateUrl from "../Hooks/useGenerateUrl";

const InputForm = (props) => {
  const appContext = useAppContext();
  const { state, dispatch } = appContext;
  const router = useRouter();
  const currentCoin = useCurrentCoin();
  const [isOpen, setIsOpen] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const generateUrl = useGenerateUrl("lump-sum");

  // Due to the constrains of the CoinGecko API, we enable calculations only
  // agter the perod of 90 days
  const isSubmitDisabled = state.input.duration < 90 || !state.input.investment;

  const mutation = useMutation(
    (payload) => axios.post("/api/calculate-lump-sum", payload),
    {
      onSuccess: (data) => {
        dispatch({
          type: ACTIONS.SET_CHART_DATA,
          payload: data.data,
        });
        dispatch({
          type: ACTIONS.SET_COIN_LOADING,
          payload: false,
        });
      },
    }
  );

  const payload = {
    coinId: state.input.coinId,
    investment: state.input.investment,
    dateFrom: state.input.dateFrom,
    currency: state.settings.currency,
  };

  const submitForm = () => {
    if (isSubmitDisabled) {
      return null;
    }

    dispatch({
      type: ACTIONS.SET_COIN_LOADING,
      payload: true,
    });

    if (!state.input.coinId) {
      return null;
    }

    generateUrl();

    mutation.mutate(payload);

    setIsOpen(false);
  };

  const onSubmit = (event) => {
    event.preventDefault();

    submitForm();
  };

  useEffectOnlyOnUpdate(() => {
    submitForm();
  }, [
    state.input.coinId,
    state.input.investmentInterval,
    state.settings.currency,
  ]);

  useEffect(() => {
    generateUrl();
  }, []);

  if (!state.settings.availableTokens) {
    return null;
  }

  return (
    <>
      <button
        className={`fixed right-8 bottom-8 z-10 md:hidden p-2 bg-indigo-500 dark:bg-yellow-500 rounded-full shadow-xl text-white dark:text-gray-900 `}
        onClick={() => {
          setIsOpen(!isOpen);
          setIsClicked(true);

          ga.event({
            action: "mobile_change_params",
            params: { calculator: "lump-sum", token: currentCoin.name },
          });
        }}
        type="button"
      >
        {mutation.isLoading ? (
          <Loading type="spin" width={40} height={40} />
        ) : (
          <span className="flex h-10 w-10">
            <span
              className={` ${
                isClicked ? "animate-none" : "animate-ping"
              } absolute inline-flex h-10 z-0 w-10 rounded-full bg-indigo-500 dark:bg-yellow-500 opacity-40`}
            />
            <span className="relative z-10 inline-flex rounded-full h-10 w-10 bg-indigo-500 dark:bg-yellow-500">
              <CalculatorIcon className="h-10 w-10" aria-hidden="true" />
            </span>
          </span>
        )}
      </button>
      <form
        className={`flex flex-col md:grid grid-cols-2 gap-4 overflow-y-auto p-4 ${
          isOpen
            ? "fixed md:static z-10 inset-0 bg-white dark:bg-gray-900"
            : "hidden md:grid"
        }`}
        onSubmit={onSubmit}
        name="dca-crypto"
        id="dca-crypto"
      >
        <div className="md:hidden col-span-2 flex justify-end">
          <button type="button" onClick={() => setIsOpen(false)}>
            <XIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="col-span-2">
          <label className="block">
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Coin
            </span>
            <div className="mt-1 flex rounded-md shadow-sm">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 text-gray-500 text-sm dark:bg-gray-700 dark:border-gray-700 dark:text-gray-200">
                <img src={currentCoin.image} className="w-5 h-5" />
              </span>
              <select
                onChange={(e) => {
                  dispatch({
                    type: ACTIONS.UPDATE_COIN_ID,
                    payload: e.target.value,
                  });
                }}
                name="coinId"
                value={currentCoin.id || ""}
                className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
              >
                {state.settings.availableTokens.map((coin, index) => (
                  <option key={coin.id} value={coin.id}>
                    #{index + 1} {coin.name}
                  </option>
                ))}
              </select>
            </div>
          </label>
        </div>
        <div className="col-span-2">
          <label className="block">
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Investment
            </span>
            <div className="mt-1 flex rounded-md shadow-sm">
              <select
                onChange={(e) =>
                  dispatch({
                    type: ACTIONS.UPDATE_CURRENCY,
                    payload: e.target.value,
                  })
                }
                className="no_arrows inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm dark:bg-gray-700 dark:border-gray-700 dark:text-gray-200"
                value={state.settings.currency}
              >
                {availableCurrencies.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder={100}
                min="1"
                max="1000000000"
                step="any"
                value={state.input.investment}
                onChange={(e) =>
                  dispatch({
                    type: ACTIONS.UPDATE_INVESTMENT,
                    payload: e.target.value,
                  })
                }
                name="investment"
                className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                placeholder="100"
              />
            </div>
          </label>
        </div>

        <div className="col-span-2">
          <label className="block">
            <span className="font-medium text-gray-700 dark:text-gray-300">
              From
            </span>
            <input
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
              type="date"
              value={state.input.dateFrom}
              onChange={(e) =>
                dispatch({
                  type: ACTIONS.UPDATE_DATE_FROM,
                  payload: e.target.value,
                })
              }
              name="dateFrom"
            />
          </label>
        </div>

        <div className="col-span-2">
          <button
            type="submit"
            className="px-4 py-2 disabled:opacity-50 rounded bg-indigo-700 hover:bg-indigo-800 text-base text-white dark:bg-yellow-500 dark:hover:bg-yellow-600 dark:text-gray-800 font-bold shadow"
            disabled={isSubmitDisabled || mutation.isLoading}
          >
            {mutation.isLoading ? "Loading..." : "Calculate"}
          </button>
          {isSubmitDisabled ? (
            <>
              <p className="text-sm p-2 text-red-500">
                Choose a time range with more then 90 days.
              </p>
              <p className="text-sm p-2 text-red-500">
                Your current range is {calculateDateRangeDifference()} days
              </p>
            </>
          ) : null}
        </div>
      </form>
    </>
  );
};

export default InputForm;
