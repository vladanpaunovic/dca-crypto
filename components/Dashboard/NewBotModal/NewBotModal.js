import { useTheme } from "next-themes";
import { PlusCircleIcon } from "@heroicons/react/outline";
import { Dialog } from "@headlessui/react";
import { useDashboardContext } from "../../DashboardContext/DashboardContext";
import {
  useAddTradingBot,
  useAllExchanges,
  useGetBalanceForNewBot,
  useGetMarketsForSelectedExchange,
  useGetTickerForBot,
} from "../../../queries/queries";
import { ACTIONS } from "../../DashboardContext/dashboardReducer";
import MoneyTransferIllustration from "../../../Illustrations/MoneyTransferIllustration";
import Loading from "../../Loading/Loading";
import Select, { components } from "react-select";
import { formatCurrency } from "@coingecko/cryptoformat";
import { useSession } from "next-auth/client";
import ExchangeForm from "./ExchangeForm";

const IconOption = (props) => {
  if (props.data.value.isActive) {
    return (
      <components.Option {...props}>
        <div className="flex items-center">
          <img
            src={`${process.env.NEXT_PUBLIC_CMS_URL}${props.data.value.available_exchange.logo.url}`}
            width={10}
            height={10}
            className="w-5 h-5 rounded-full mr-2"
            alt={props.label}
          />
          {props.data.label}
        </div>
      </components.Option>
    );
  }

  return (
    <components.Option {...props}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <img
            src={`${process.env.NEXT_PUBLIC_CMS_URL}${props.value.logo.url}`}
            width={10}
            height={10}
            className="w-5 h-5 rounded-full mr-2"
            alt={props.label}
          />
          {props.label}
        </div>
        <span className="px-2 bg-gray-200 rounded-full dark:bg-gray-900 dark:text-gray-200">
          Connect
        </span>
      </div>
    </components.Option>
  );
};

const customStyles = (theme) => {
  const isLight = theme === "light";
  return {
    menu: (provided) => ({
      ...provided,
      backgroundColor: isLight ? "#F3F4F6" : "#1F2937",
    }),
    option: (provided) => {
      return {
        ...provided,
        "&:hover": {
          backgroundColor: isLight ? "#E5E7EB" : "#111827",
        },
        backgroundColor: isLight ? "white" : "#1F2937",
        color: isLight ? "#1F2937" : "#F3F4F6",
      };
    },
    menubar: (provided) => ({
      ...provided,
      backgroundColor: isLight ? "white" : "#1F2937",
    }),
    control: (provider) => {
      return {
        ...provider,
        backgroundColor: isLight ? "white" : "#1F2937",
        borderColor: isLight ? "#E5E7EB" : "#1F2937",
      };
    },
    input: (provider) => ({
      ...provider,
      color: isLight ? "#1F2937" : "#F3F4F6",
    }),
    singleValue: (provided) => {
      return { ...provided, color: isLight ? "#1F2937" : "#F3F4F6" };
    },
  };
};

function Exchanges() {
  const { state, dispatch } = useDashboardContext();
  const { theme } = useTheme();
  const [myExchanges, availableExchanges] = useAllExchanges();

  const options = myExchanges.data
    ? myExchanges.data.map((exchange) => {
        return {
          value: { ...exchange, isActive: true },
          label: exchange.available_exchange.label,
        };
      })
    : [];

  const setValue = (value) => {
    if (value?.available_exchange) {
      return {
        value,
        label: value.available_exchange.label,
      };
    }
    return null;
  };

  const availableOptions = availableExchanges.data
    ? availableExchanges.data.map((exchange) => ({
        value: { ...exchange, isActive: false },
        label: exchange.label,
      }))
    : [];

  return (
    <div className="w-full">
      <div>
        <label className="text-sm">
          <span className="font-medium">Exchange</span>
          <Select
            options={[...options, ...availableOptions]}
            components={{ Option: IconOption }}
            className="react-select-container mt-1"
            value={setValue(state.newBot.exchange)}
            styles={customStyles(theme)}
            classNamePrefix="react-select"
            placeholder="Choose..."
            isLoading={myExchanges.isLoading}
            loadingMessage="Fetching list from exchange..."
            isDisabled={myExchanges.isLoading}
            onChange={(payload) => {
              dispatch({ type: ACTIONS.SET_EXCHANGE, payload: payload.value });
            }}
          />
        </label>
      </div>
    </div>
  );
}

function CryptoCurrencyList() {
  const { state, dispatch } = useDashboardContext();
  const getMarkets = useGetMarketsForSelectedExchange();
  const getTicker = useGetTickerForBot();
  const { theme } = useTheme();

  const options = getMarkets.data
    ? getMarkets.data.map((market) => ({
        value: market,
        label: market.symbol,
      }))
    : [];

  const fromCurrency = state.newBot.tradingPair
    ? formatCurrency(1, state.newBot.tradingPair.value.base)
    : "loading...";
  const quotePrice =
    getTicker.data && state.newBot.tradingPair
      ? formatCurrency(
          getTicker.data.close,
          state.newBot.tradingPair.value.quote
        )
      : "loading...";

  return (
    <div className="w-full">
      <div>
        <label className="text-sm">
          <span className="font-medium">Cryptocurrency pair</span>
          <Select
            options={options}
            value={state.newBot.tradingPair}
            className="react-select-container mt-1"
            styles={customStyles(theme)}
            classNamePrefix="react-select"
            isLoading={getMarkets.isLoading}
            loadingMessage="Fetching list from exchange..."
            isDisabled={getMarkets.isLoading}
            placeholder="Choose asset..."
            onChange={(payload) => {
              dispatch({ type: ACTIONS.SET_TRADING_PAIR, payload });
            }}
          />
          <p className="text-xs mt-1 text-gray-600">
            Current price for {fromCurrency} = {quotePrice}
          </p>
        </label>
      </div>
    </div>
  );
}

const NewBotForm = () => {
  const { state, dispatch } = useDashboardContext();
  const getBalance = useGetBalanceForNewBot();

  const baseCurrencyBalanceRaw = getBalance.data?.free
    ? getBalance.data?.free[state.newBot.tradingPair?.value?.quoteId]
    : 0;

  console.log(getBalance.data);
  const baseCurrencyBalance =
    getBalance.data && getBalance.data.free
      ? formatCurrency(
          baseCurrencyBalanceRaw,
          state.newBot.tradingPair.value.quote
        )
      : "loading...";

  const minimumInvestment =
    state.newBot.tradingPair?.value && state.newBot.minimum_amount
      ? formatCurrency(
          state.newBot.minimum_amount,
          state.newBot.tradingPair.value.quote
        )
      : "loading...";

  return (
    <>
      <label className="block mb-3">
        <span className="font-medium text-gray-700 dark:text-gray-300">
          Investment
        </span>
        <input
          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
          type="number"
          name="investment"
          required
          value={state.newBot.investment}
          disabled={!state.newBot.tradingPair}
          min={Math.round(state.newBot.minimum_amount)}
          stap="any"
          onChange={(e) =>
            dispatch({
              type: ACTIONS.SET_BOT_INVESTMENT,
              payload: e.target.value,
            })
          }
        />
        <p
          className={`mt-1 text-xs ${
            state.newBot.investment < state.newBot.minimum_amount
              ? "text-red-500"
              : "text-gray-600 "
          }`}
        >
          Minimum investment is {minimumInvestment}
        </p>
      </label>

      <label className="block">
        <span className="font-medium text-gray-700 dark:text-gray-300">
          Every
        </span>
        <div className="mt-1 flex rounded-md shadow-sm">
          <input
            type="number"
            min="1"
            max="100"
            step="1"
            name="investment_interval"
            disabled={!state.newBot.tradingPair}
            value={state.newBot.investment_interval}
            onChange={(e) =>
              dispatch({
                type: ACTIONS.SET_BOT_INVESTMENT_INTERVAL,
                payload: e.target.value,
              })
            }
            className=" flex-1 block rounded-none rounded-l-md sm:text-sm border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
          />
          <select
            value={state.newBot.interval_type}
            disabled={!state.newBot.tradingPair}
            onChange={(e) =>
              dispatch({
                type: ACTIONS.SET_BOT_INTERVAL_TYPE,
                payload: e.target.value,
              })
            }
            className="focus:border-gray-300  inline-flex w-2/6 items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-sm dark:bg-gray-700 dark:border-gray-700 dark:text-gray-200"
          >
            <option value="minute">minutes</option>
            <option value="hour">hours</option>
            <option value="day">days</option>
            <option value="week">weeks</option>
          </select>
        </div>
        <p
          className={`mt-1 text-xs ${
            baseCurrencyBalanceRaw < state.newBot.investment
              ? "text-red-500"
              : "text-gray-600 "
          }`}
        >
          Current balance on exchange is {baseCurrencyBalance}
          {baseCurrencyBalanceRaw < state.newBot.investment &&
            " (insufficient balance)"}
        </p>
      </label>
    </>
  );
};

const NewBotModal = () => {
  const { state, dispatch } = useDashboardContext();
  const [session] = useSession();

  const getBalance = useGetBalanceForNewBot();

  const baseCurrencyBalanceRaw = getBalance.data?.free
    ? getBalance.data?.free[state.newBot.tradingPair?.value?.quoteId]
    : 0;
  const addTradingBot = useAddTradingBot();

  const isSubmitDisabled =
    !state.newBot.tradingPair ||
    !state.newBot.exchange ||
    !state.newBot.investment ||
    !state.newBot.investment_interval ||
    !state.newBot.interval_type ||
    state.newBot.investment < state.newBot.minimum_amount ||
    baseCurrencyBalanceRaw < state.newBot.investment;

  const investment = state.newBot.tradingPair?.value
    ? formatCurrency(
        state.newBot.investment,
        state.newBot.tradingPair.value.quote
      )
    : "loading...";
  const interval =
    state.newBot.investment_interval > 1
      ? `${state.newBot.interval_type}s`
      : state.newBot.interval_type;

  const handleOnSubmit = (e) => {
    e.preventDefault();

    const payload = {
      origin_currency: state.newBot.tradingPair.value.baseId,
      destination_currency: state.newBot.tradingPair.value.quoteId,
      origin_currency_amount: state.newBot.investment,
      investing_interval: state.newBot.investment_interval,
      available_exchange: state.newBot.exchange.available_exchange.id,
      trading_pair: state.newBot.tradingPair.value.symbol,
      interval_type: state.newBot.interval_type,
      users_permissions_user: session.user.id,
      exchange: state.newBot.exchange._id,
    };

    addTradingBot.mutate(payload);
  };

  const dialogContent = (
    <form onSubmit={handleOnSubmit} disabled={isSubmitDisabled}>
      <div className="bg-white dark:bg-gray-900 px-4 pt-5 rounded-t-lg pb-4 sm:p-6 sm:pb-4 ">
        <div>
          <div className="mt-2">
            <h3
              className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100"
              id="modal-title"
            >
              Add new bot
            </h3>
            <div className="mt-6">
              <Exchanges />
            </div>

            {state.newBot.exchange ? (
              <>
                <div className="mt-4">
                  <CryptoCurrencyList />
                </div>
                <div className="mt-4">
                  <NewBotForm />
                </div>
                <p className="py-4 px-2 bg-gray-200 dark:bg-gray-800 rounded-lg text-xs mt-8 mb-4 text-center">
                  Buying {state.newBot.tradingPair?.value.base} for {investment}{" "}
                  every {state.newBot.investment_interval} {interval}.
                </p>
              </>
            ) : (
              <div className="flex items-center justify-center">
                <MoneyTransferIllustration className="w-48 h-48" />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="bg-gray-50 rounded-b-lg dark:bg-gray-800 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
        <button
          type="submit"
          disabled={isSubmitDisabled || addTradingBot.isLoading}
          className="transition disabled:opacity-50 mt-3 w-full inline-flex justify-center rounded-md dark:bg-yellow-500 shadow-sm px-4 py-2 bg-indigo-500 text-base font-medium text-white dark:text-gray-900 hover:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-yellow-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
        >
          Create bot{" "}
          {addTradingBot.isLoading && (
            <span className="ml-1">
              <Loading width={20} height={20} />
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={() =>
            dispatch({ type: ACTIONS.SET_IS_MODAL_OPEN, payload: false })
          }
          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-800 dark:bg-gray-900 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 dark:text-yellow-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
        >
          Close
        </button>
      </div>
    </form>
  );

  const addExchange = (
    <div>
      <ExchangeForm exchange={state.newExchange} />
    </div>
  );

  return (
    <>
      <button
        onClick={() =>
          dispatch({ type: ACTIONS.SET_IS_MODAL_OPEN, payload: true })
        }
        className="focus:outline-none flex items-center text-gray-500 dark:text-gray-600 dark:border-gray-700 hover:text-gray-900 dark:hover:text-gray-100 transition rounded"
      >
        <PlusCircleIcon className="w-8 h-8 mr-2" />
        Add new bot
      </button>

      <div className="relative">
        <Dialog
          open={state.newBot.isModalOpen}
          onClose={() =>
            dispatch({ type: ACTIONS.SET_IS_MODAL_OPEN, payload: false })
          }
          className="fixed z-10 inset-0 overflow-y-auto text-center"
        >
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-60" />
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <div className="inline-block align-middle rounded-lg text-left shadow-xl transform transition-all sm:my-8 sm:max-w-sm sm:w-full">
            {state.newExchange ? addExchange : dialogContent}
          </div>
        </Dialog>
      </div>
    </>
  );
};

export default NewBotModal;
