"use client";
import { useMutation } from "react-query";
import { XIcon, CalculatorIcon } from "@heroicons/react/outline";
import { ACTIONS } from "../Context/mainReducer";
import { useState } from "react";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { availableCurrencies } from "../../config";
import Loading from "react-loading";
import * as ga from "../helpers/GoogleAnalytics";
import {
  availableInvestmentIntervals,
  calculateDateRangeDifference,
} from "../../common/generateDefaultInput";
import SelectCoin from "../SelectCoin/SelectCoin";
import apiClient from "../../server/apiClient";
import { getFingerprint } from "../../common/fingerprinting";
import { useSession } from "next-auth/react";
import { useStore } from "../../src/store/store";

dayjs.extend(isSameOrBefore);

const before90Days = dayjs().subtract(91, "days").format("YYYY-MM-DD");

const InputForm = ({ availableTokens }) => {
  const session = useSession();

  const state = useStore();
  const dispatch = state.dispatch;

  const [isOpen, setIsOpen] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const canProceed = state.chart?.canProceed || { proceed: false };
  const freeTierLimitReached = !canProceed.proceed;

  // Due to the constrains of the CoinGecko API, we enable calculations only
  // after the perod of 90 days
  const isSubmitDisabled = state.input.duration < 90 || !state.input.investment;

  const mutation = useMutation(
    (payload) => apiClient.post("calculate/common", payload),
    {
      onSuccess: (data) => {
        console.log(data);
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
    investmentInterval: state.input.investmentInterval,
    investment: state.input.investment,
    dateFrom: state.input.dateFrom,
    dateTo: state.input.dateTo,
    currency: state.settings.currency,
  };

  const submitForm = async () => {
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

    const fingerprint = await getFingerprint();

    mutation.mutate({ ...payload, session: session.data, fingerprint });

    setIsOpen(false);
  };

  const onSubmit = (event) => {
    event.preventDefault();

    submitForm();
  };

  return (
    <>
      <button
        className={`fixed right-8 bottom-8 z-10 md:hidden p-2 bg-indigo-500 rounded-full shadow-xl text-white`}
        onClick={() => {
          setIsOpen(!isOpen);
          setIsClicked(true);

          ga.event({
            action: "mobile_change_params",
            params: { calculator: "dca" },
          });
        }}
        type="button"
        aria-label="Change parameters"
        data-testid="button-open-change-params"
      >
        {mutation.isLoading ? (
          <Loading type="spin" width={40} height={40} />
        ) : (
          <span className="flex h-10 w-10">
            <span
              className={` ${
                isClicked ? "animate-none" : "animate-ping"
              } absolute inline-flex h-10 z-0 w-10 rounded-full bg-indigo-500 opacity-40`}
            />
            <span className="relative z-10 inline-flex rounded-full h-10 w-10 bg-indigo-500">
              <CalculatorIcon className="h-10 w-10" aria-hidden="true" />
            </span>
          </span>
        )}
      </button>
      <form
        className={`flex flex-col md:grid grid-cols-2 gap-4 overflow-y-auto p-4 ${
          isOpen ? "fixed md:static z-10 inset-0 bg-white" : "hidden md:grid"
        }`}
        onSubmit={onSubmit}
        name="dca-crypto"
        data-testid="change-params-form"
        id="dca-crypto"
      >
        <div className="md:hidden col-span-2 flex justify-end">
          <button
            type="button"
            data-testid="button-close-change-params"
            onClick={() => setIsOpen(false)}
          >
            <XIcon className="text-gray-900 h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="col-span-2">
          <label className="block">
            <span className="font-medium text-gray-700">Coin</span>
            <div className="mt-1 flex rounded-md shadow-sm">
              <SelectCoin availableTokens={availableTokens} />
            </div>
          </label>
        </div>
        <div className="col-span-2">
          <label className="block">
            <span className="font-medium text-gray-700">Investment</span>
            <div className="mt-1 flex rounded-md shadow-sm">
              <select
                onChange={(e) =>
                  dispatch({
                    type: ACTIONS.UPDATE_CURRENCY,
                    payload: e.target.value,
                  })
                }
                className="no_arrows inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm"
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
                className="text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
              />
            </div>
          </label>
        </div>
        <div className="col-span-2">
          <label className="block">
            <span className="font-medium text-gray-700">
              Investment interval
            </span>
            <select
              onChange={(opt) =>
                dispatch({
                  type: ACTIONS.UPDATE_INVESTMENT_INTERVAL,
                  payload: opt.target.value,
                })
              }
              name="investmentInterval"
              value={state.input.investmentInterval || ""}
              className="text-gray-900 mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            >
              {availableInvestmentIntervals.map((interval) => (
                <option key={interval.value} value={interval.value}>
                  {interval.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="col-span-2">
          <label className="block">
            <span className="font-medium text-gray-700">From</span>
            <input
              style={{ colorScheme: "light" }}
              className="text-gray-900 mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              type="date"
              value={state.input.dateFrom}
              max={before90Days}
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
          <label className="block">
            <span className="font-medium text-gray-700">To</span>
            <input
              style={{ colorScheme: "light" }}
              className="text-gray-900 mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              type="date"
              value={state.input.dateTo}
              onChange={(e) =>
                dispatch({
                  type: ACTIONS.UPDATE_DATE_TO,
                  payload: e.target.value,
                })
              }
              name="dateTo"
              max={dayjs().format("YYYY-MM-DD")}
            />
          </label>
        </div>
        <div className="col-span-2">
          {/* <button
            type="submit"
            className="px-4 py-2 w-full disabled:opacity-50 rounded bg-gray-900 hover:bg-gray-800 text-base text-white font-bold shadow"
            disabled={
              isSubmitDisabled || mutation.isLoading || freeTierLimitReached
            }
          >
            {mutation.isLoading ? "Loading..." : "Calculate"}
          </button> */}
          {isSubmitDisabled ? (
            <>
              <p className="text-sm p-2 text-red-500">
                Choose a time range with more then 90 days.
              </p>
              <p className="text-sm p-2 text-red-500">
                Your current range is{" "}
                {calculateDateRangeDifference(
                  state.input.dateFrom,
                  state.input.dateTo
                )}{" "}
                days
              </p>
            </>
          ) : null}
          {canProceed.sessionUserCount ? (
            <p className="text-gray-900 text-xs p-2 bg-gray-100 mt-4 rounded-lg">
              Used free calculations:{" "}
              <b>
                {canProceed.sessionUserCount} out of {canProceed.available}
              </b>
            </p>
          ) : null}
          {freeTierLimitReached ? (
            <p className="text-sm py-2 text-red-500">Limit reached.</p>
          ) : null}
        </div>
      </form>
    </>
  );
};

export default InputForm;
