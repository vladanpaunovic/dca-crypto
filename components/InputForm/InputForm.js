import { XIcon, CalculatorIcon } from "@heroicons/react/outline";
import { ACTIONS } from "../Context/mainReducer";
import { useState } from "react";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { availableCurrencies } from "../../config";
import * as ga from "../helpers/GoogleAnalytics";
import useEffectOnlyOnUpdate from "../Hooks/useEffectOnlyOnUpdate";
import {
  availableInvestmentIntervals,
  calculateDateRangeDifference,
} from "../../common/generateDefaultInput";
import SelectCoin from "../SelectCoin/SelectCoin";
import { useAppState } from "../../src/store/store";

dayjs.extend(isSameOrBefore);

const before90Days = dayjs().subtract(91, "days").format("YYYY-MM-DD");

const InputForm = () => {
  const store = useAppState();
  const currentCoin = store.currentCoin;
  const [isOpen, setIsOpen] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const canProceed = store.canProceed;
  const freeTierLimitReached = !canProceed.proceed;
  // Due to the constrains of the CoinGecko API, we enable calculations only
  // agter the perod of 90 days
  const isSubmitDisabled = store.input.duration < 90 || !store.input.investment;

  const submitForm = async () => {
    store.dispatch({
      type: ACTIONS.CALCULATE_CHART_DATA,
    });

    return;
  };

  const onSubmit = (event) => {
    event.preventDefault();

    submitForm();
  };

  useEffectOnlyOnUpdate(() => {
    submitForm();
  }, [store.input, store.settings.currency]);

  return (
    <>
      <button
        className={`fixed right-8 bottom-8 z-10 md:hidden p-2 bg-indigo-500 rounded-full shadow-xl text-white`}
        onClick={() => {
          setIsOpen(!isOpen);
          setIsClicked(true);

          ga.event({
            action: "mobile_change_params",
            params: { calculator: "dca", token: currentCoin.name },
          });
        }}
        type="button"
        aria-label="Change parameters"
        data-testid="button-open-change-params"
      >
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
      </button>
      <form
        className={`px-4 md:px-0 flex flex-col md:grid grid-cols-2 gap-4 overflow-y-auto ${
          isOpen ? "fixed md:static z-10 inset-0 bg-white" : "hidden md:grid"
        }`}
        onSubmit={onSubmit}
        name="dca-crypto"
        data-testid="change-params-form"
        id="dca-crypto"
      >
        <div className="md:hidden pt-4 col-span-2 flex justify-end">
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
              <SelectCoin />
            </div>
          </label>
        </div>
        <div className="col-span-2">
          <label className="block">
            <span className="font-medium text-gray-700">Investment</span>
            <div className="mt-1 flex rounded-md shadow-sm">
              <select
                onChange={(e) =>
                  store.dispatch({
                    type: ACTIONS.UPDATE_CURRENCY,
                    payload: e.target.value,
                  })
                }
                className="no_arrows inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm"
                value={store.settings.currency}
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
                value={store.input.investment}
                onChange={(e) =>
                  store.dispatch({
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
                store.dispatch({
                  type: ACTIONS.UPDATE_INVESTMENT_INTERVAL,
                  payload: opt.target.value,
                })
              }
              name="investmentInterval"
              value={store.input.investmentInterval || ""}
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
              value={store.input.dateFrom}
              max={before90Days}
              onChange={(e) =>
                store.dispatch({
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
              value={store.input.dateTo}
              onChange={(e) =>
                store.dispatch({
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
          {isSubmitDisabled ? (
            <>
              <p className="text-sm p-2 text-red-500">
                Choose a time range with more then 90 days.
              </p>
              <p className="text-sm p-2 text-red-500">
                Your current range is{" "}
                {calculateDateRangeDifference(
                  store.input.dateFrom,
                  store.input.dateTo
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
