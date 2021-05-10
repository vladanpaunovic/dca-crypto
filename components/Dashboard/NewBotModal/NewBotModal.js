import { PlusCircleIcon } from "@heroicons/react/outline";
import { useState } from "react";
import { Dialog } from "@headlessui/react";
import cmsClient from "../../../server/cmsClient";
import Loading from "../../Loading/Loading";
import { useMutation, useQuery } from "react-query";
import { useSession } from "next-auth/client";
import InputBox from "../InputBox";
import { queryClient } from "../../../pages/_app";
import { useDashboardContext } from "../../DashboardContext/DashboardContext";
import { ACTIONS } from "../../DashboardContext/dashboardReducer";
import { useGetMarkets, useGetTicker } from "../../../queries/queries";

const Exchange = (props) => {
  return (
    <button
      type="button"
      onClick={() => props.onClick(props)}
      className="p-2 bg-gray-100 dark:bg-gray-800 font-medium text-gray-900 dark:text-yellow-500 rounded hover:opacity-60 transition"
    >
      {props.available_exchange.label}
    </button>
  );
};

const NewBotForm = (props) => {
  const { dispatch } = useDashboardContext();
  const onlyMyExchanges = queryClient.getQueryData("only-my-exchanges");
  const [session] = useSession();

  const [state, setState] = useState({
    exchange: null,
    available_exchange: "choose-exchange",
    trading_pair: null,
    users_permissions_user: session.user.id,
    origin_currency: "",
    destination_currency: "",
    origin_currency_amount: 10,
    investing_interval: 7,
    interval_type: "day",
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: async (payload) =>
      await cmsClient(session.accessToken).post("/trading-bots", payload),
    mutationKey: "add-bot",
    onSettled: async (data) => {
      await queryClient.refetchQueries(["my-bots"]);
      dispatch({ type: ACTIONS.SET_SELECTED_BOT, payload: data.data });

      props.onClose();
    },
  });

  const getMarkets = useGetMarkets(state.exchange);
  const getTicker = useGetTicker({
    state,
    onSuccess: (data) => setState(data),
  });

  const handleOnsubmit = (e) => {
    e.preventDefault();

    mutate({
      ...state,
      trading_pair: state.trading_pair.symbol,
      exchange: state.exchange._id,
    });
  };

  return (
    <form className="mt-8" onSubmit={handleOnsubmit}>
      <div className="col-span-2">
        {!state.exchange && (
          <>
            {" "}
            <span className="block font-medium text-gray-700 dark:text-gray-300">
              Select exchange
            </span>
            <div className="grid grid-cols-3 gap-4 my-4">
              {props.availableExchanges.map((exchange) => (
                <Exchange
                  {...exchange}
                  key={exchange.id}
                  onClick={(e) => {
                    const exchange = onlyMyExchanges.find(
                      (ex) =>
                        ex.available_exchange.id === e.available_exchange.id
                    );

                    setState({
                      ...state,
                      available_exchange: e.available_exchange.id,
                      exchange,
                    });
                  }}
                />
              ))}
            </div>
          </>
        )}

        {state.exchange && (
          <>
            <label className="block mb-2">
              <span className="font-medium text-gray-700 dark:text-gray-300">
                Pair
              </span>
              <select
                onChange={(e) => {
                  const tradingPair = getMarkets.data.find(
                    (product) => product.id === e.target.value
                  );

                  setState({
                    ...state,
                    trading_pair: tradingPair,
                    origin_currency: tradingPair.base,
                    destination_currency: tradingPair.quote,
                  });
                }}
                name="origin_currency"
                value={state.trading_pair?.id || "choose-trading-pair"}
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
              >
                <option value="choose-trading-pair" disabled>
                  Choose trading pair
                </option>
                {getMarkets.data?.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.symbol}
                  </option>
                ))}
              </select>
            </label>
          </>
        )}

        {state.exchange && state.trading_pair && (
          <>
            <InputBox
              identifier="origin_currency_amount"
              label={`Capital in ${state.trading_pair?.quote}`}
              value={state.origin_currency_amount}
              type="text"
              min={
                getTicker.isLoading
                  ? 0
                  : state.trading_pair?.limits?.amount?.min *
                    getTicker.data?.close *
                    1.1
              }
              onChange={(e) =>
                setState({ ...state, origin_currency_amount: e.target.value })
              }
            />
            <p className="text-sm mb-2 text-gray-500 dark:text-gray-200">
              Minimum order for {state.trading_pair?.base}, on{" "}
              {state.exchange.available_exchange.label} is{" "}
              {getTicker.isLoading
                ? "Loading..."
                : state.trading_pair?.limits?.amount?.min *
                  getTicker.data?.close *
                  1.1}{" "}
              {state.trading_pair?.quote}
            </p>
            <InputBox
              identifier="investing_interval"
              label="Investing interval"
              value={state.investing_interval}
              onChange={(e) =>
                setState({ ...state, investing_interval: e.target.value })
              }
            />
            <label className="block mb-2">
              <span className="font-medium text-gray-700 dark:text-gray-300">
                Interval type
              </span>
              <select
                onChange={(e) => {
                  setState({
                    ...state,
                    interval_type: e.target.value,
                  });
                }}
                name="interval_type"
                value={state.interval_type}
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
              >
                <option value="minute">Minutes</option>
                <option value="hour">Hours</option>
                <option value="day">Days</option>
                <option value="week">Weeks</option>
              </select>
            </label>
            <h4 className="font-medium text-gray-900 dark:text-white ">
              Summary
            </h4>
            <p className="mb-2 mt-1 max-w-2xl text-sm text-gray-500 dark:text-white">
              You will invest {state.origin_currency_amount}{" "}
              {state.trading_pair?.quote} in {state.trading_pair?.base} every{" "}
              {state.investing_interval} {state.interval_type}
            </p>
            <button
              type="submit"
              disabled={isLoading}
              className="flex py-1 px-4 bg-indigo-500 rounded text-gray-100"
            >
              {isLoading ? (
                <>
                  <span className="mr-1">Submit</span>{" "}
                  <Loading width={25} height={25} />
                </>
              ) : (
                "Submit"
              )}
            </button>
          </>
        )}
      </div>
    </form>
  );
};

const NewBotModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [session] = useSession();

  const { data, isLoading } = useQuery("only-my-exchanges", async () => {
    const response = await cmsClient(session.accessToken).get("/exchanges");
    return response.data;
  });

  return (
    <>
      {isLoading ? (
        <div className="p-1">
          <Loading width={25} height={25} />
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="focus:outline-none flex items-center text-gray-500 dark:text-gray-600 dark:border-gray-700 hover:text-gray-900 dark:hover:text-gray-100 transition rounded"
        >
          <PlusCircleIcon className="w-8 h-8 mr-2" />
          Add new bot
        </button>
      )}

      <div className="relative">
        <Dialog
          open={isOpen}
          onClose={() => setIsOpen(false)}
          className="fixed z-10 inset-0 overflow-y-auto text-center"
        >
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-90 " />
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <div className="inline-block align-middle rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-xl sm:w-full">
            <div className="bg-white dark:bg-gray-900 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div>
                <div className="mt-6">
                  <h3
                    className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100"
                    id="modal-title"
                  >
                    Add new bot
                  </h3>
                  <div className="mt-2">
                    <NewBotForm
                      availableExchanges={data}
                      onClose={() => setIsOpen(false)}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-800 dark:bg-gray-900 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 dark:text-yellow-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </Dialog>
      </div>
    </>
  );
};

export default NewBotModal;
