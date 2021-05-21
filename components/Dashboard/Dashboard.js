import DashboardChart from "./DashboardChart/DashboardChart";
import { useDashboardContext } from "../DashboardContext/DashboardContext";
import { formatCurrency } from "@coingecko/cryptoformat";
import {
  ArrowSmUpIcon,
  ArrowSmDownIcon,
  TrashIcon,
  RefreshIcon,
  ClockIcon,
  PresentationChartLineIcon,
  CurrencyDollarIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  SwitchHorizontalIcon,
  CashIcon,
} from "@heroicons/react/outline";
import getPercentageChange from "../helpers/getPercentageChange";
import BotList from "./BotList";
import ChooseIllustration from "../../Illustrations/ChooseIllustration";
import { kFormatter } from "../Chart/helpers";
import dayjs from "dayjs";
import { Popover, Transition } from "@headlessui/react";
import Loading from "../Loading/Loading";
import DashboardLayout from "./DashboardLayout";
import OrdersDataTable from "./OrdersDataTable";
import BotStatus from "./BotStatus";
import {
  useGetTickers,
  useGetBalance,
  useRemoveTradingBot,
  useUpdateTradingBot,
  useGetMyBots,
} from "../../queries/queries";
import DashboardMenu from "./Menu/DashboardMenu";
import EmptyIllustration from "../../Illustrations/EmptyIllustration";
import Banner from "../Banner/Banner";
import EditPopover from "./EditPopover";

const RemoveButton = () => {
  const { state } = useDashboardContext();

  const { mutate, isLoading: isRemoving } = useRemoveTradingBot();

  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button className="focus:outline-none px-1 py-1 flex items-center justify-between text-xs leading-5 font-semibold rounded-full  hover:bg-red-100 dark:hover:bg-red-400 text-gray-400">
            {isRemoving ? (
              <span className="mx-1">
                <Loading width={20} height={20} />
              </span>
            ) : (
              <TrashIcon className="w-5 h-5" />
            )}
          </Popover.Button>
          <Transition
            show={open}
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Popover.Panel className="absolute z-10 w-screen px-4 mt-3 transform -translate-x-2/2 right-1/2 max-w-sm">
              <div className="p-4 bg-white dark:bg-gray-900 rounded border dark:border-gray-700 shadow max-w-sm">
                <h4 className="text-normal font-medium mb-2">Are you sure?</h4>
                <p className="mb-2 text-gray-600 dark:text-gray-300">
                  Removing the trading bot will stop the execution of upcoming
                  trades and remove all data related to it from our systems.
                </p>
                <p className="mb-4 text-gray-600 dark:text-gray-300">
                  If you don't need this bot now, we suggest, you just put it on
                  pause.
                </p>

                <button
                  disabled={isRemoving}
                  onClick={() => mutate(state.selectedBot.id)}
                  className="flex justify-center items-center rounded font-medium bg-red-500 p-2 text-white dark:text-gray-900 w-full"
                >
                  Yes, remove {state.selectedBot.trading_pair} bot
                  {isRemoving ? (
                    <span className="mx-1">
                      <Loading width={20} height={20} />
                    </span>
                  ) : (
                    <TrashIcon className="ml-2 w-5 h-5" />
                  )}
                </button>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

const Stat = (props) => {
  return (
    <div className={props.className}>
      <div className="relative">
        <div className="flex items-start p-4 ">
          <div className="p-3 mr-6 bg-gradient-to-br from-indigo-400 dark:from-yellow-400 to-indigo-600 dark:to-yellow-600 rounded">
            {props.icon}
          </div>
          <div className="flex-1">
            <p className="text-gray-500 dark:text-gray-300 font-medium">
              {props.title}
            </p>
            <div className="flex items-baseline">
              <h2 className="text-xl font-semibold">{props.value}</h2>
            </div>
            <div className="text-gray-500 mt-1">{props.description}</div>
            <div className="absolute left-0 bottom-0 w-full">
              {props.progressBar}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ChartInfo = () => {
  const { state } = useDashboardContext();
  const getTickers = useGetTickers();

  if (!state.selectedBot) {
    return null;
  }

  const updateTradingBot = useUpdateTradingBot();
  const botExchange = state.selectedBot.available_exchange.identifier;

  const balance = useGetBalance(botExchange);

  const baseCurrencyBalance =
    balance.data && balance.data.free
      ? balance.data.free[state.selectedBot.destination_currency]
      : 0;
  const hasBalance =
    baseCurrencyBalance > state.selectedBot.origin_currency_amount;
  const durationEstimate = Math.floor(
    baseCurrencyBalance /
      (state.selectedBot.origin_currency_amount /
        state.selectedBot.investing_interval)
  );

  const priceNow = getTickers.data
    ? getTickers.data[getTickers.data.length - 1]?.price
    : 0;

  const averageCost =
    state.selectedBot.orders && state.selectedBot.orders.length
      ? state.selectedBot.orders[state.selectedBot.orders.length - 1]
          .averageCost
      : priceNow;

  const totalBaseAmount = state.selectedBot.orders.reduce(
    (prev, curr) => prev + curr.amount,
    0
  );

  const allCryptoValue = totalBaseAmount * priceNow;

  const totalInvestment =
    state.selectedBot.orders.length * state.selectedBot.origin_currency_amount;

  const percentageDifference = getPercentageChange(
    totalInvestment,
    allCryptoValue
  );

  const valueDifference = allCryptoValue - totalInvestment;

  const lastOrder =
    state.selectedBot.orders[state.selectedBot.orders.length - 1];
  const nextOrderDate = dayjs(lastOrder ? lastOrder.dateTime : new Date()).add(
    state.selectedBot.investing_interval,
    state.selectedBot.interval_type
  );

  const diffUntilNextOrder = () => {
    if (!state.selectedBot.isActive || state.selectedBot.errorMessage) {
      return (
        <>
          <span className="line-through">
            {dayjs().to(dayjs(nextOrderDate))}
          </span>{" "}
          disabled
        </>
      );
    }

    return dayjs().to(dayjs(nextOrderDate));
  };

  const timeSinceLastOrder = dayjs().to(
    dayjs(lastOrder ? lastOrder.dateTime : new Date())
  );

  const getPercentageDifference = (change) => {
    if (isNaN(change)) {
      return "0%";
    }

    return change > 0 ? (
      <>
        <span className="text-green-500 flex items-center">
          <ArrowSmUpIcon className="w-5 h-5" /> {change}%
        </span>
      </>
    ) : (
      <>
        <span className="text-red-400 flex items-center">
          <ArrowSmDownIcon className="w-5 h-5" /> {change}%
        </span>
      </>
    );
  };

  return (
    <>
      <div className="mb-10">
        {!state.selectedBot.isActive && state.selectedBot.errorMessage && (
          <div
            className="shadow-lg border-2 border-red-500 px-4 py-3 rounded relative"
            role="alert"
          >
            <p>
              <strong className="font-bold">Error</strong>
            </p>
            <p className="mb-4 text-gray-600 dark:text-gray-300">
              While processing your order, we received the following error from
              your exchange:
            </p>

            <p className="mb-4 bg-gray-100 dark:bg-gray-800 p-2 rounded">
              {state.selectedBot.errorMessage}
            </p>

            <p className="mb-4 text-gray-600 dark:text-gray-300">
              This bot will remain <b>disabled</b> until you fix the issue with
              your exchange. Once fixed, please mark it as resolved so we can
              try again.
            </p>
            <button
              disabled={updateTradingBot.isLoading}
              onClick={() =>
                updateTradingBot.mutate({
                  isActive: true,
                  errorMessage: "",
                })
              }
              className="flex mt-4 justify-center items-center rounded font-medium bg-indigo-500 dark:bg-yellow-500 px-4 py-2 text-white dark:text-gray-900 "
            >
              I resolved it, try again{" "}
              {updateTradingBot.isLoading ? (
                <span className="ml-2 ">
                  <Loading width={20} height={20} type="spin" />
                </span>
              ) : (
                <RefreshIcon className="ml-2 w-5 h-5" />
              )}
            </button>
          </div>
        )}
      </div>
      <div className="grid grid-cols-3 gap-0 lg:gap-8 divide-y lg:divide-none">
        <Stat
          className="col-span-3 lg:col-span-1"
          title={`Current holdings`}
          icon={
            allCryptoValue < totalInvestment ? (
              <TrendingDownIcon className="w-6 h-6 text-white dark:text-gray-900" />
            ) : (
              <TrendingUpIcon className="w-6 h-6 text-white dark:text-gray-900" />
            )
          }
          value={
            allCryptoValue < totalInvestment ? (
              <span className="text-red-500">
                {formatCurrency(
                  allCryptoValue,
                  state.selectedBot.destination_currency
                )}
              </span>
            ) : (
              <span className="text-green-500">
                {formatCurrency(
                  allCryptoValue,
                  state.selectedBot.destination_currency
                )}
              </span>
            )
          }
          description={
            <div className="flex items-center">
              <span
                className={
                  valueDifference >= 0 ? "text-green-500" : "text-red-500"
                }
              >
                {percentageDifference &&
                  getPercentageDifference(percentageDifference)}
              </span>
              <span
                className={`ml-2 ${
                  valueDifference >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {valueDifference > 0 ? "+" : ""}
                {formatCurrency(
                  valueDifference,
                  state.selectedBot.destination_currency
                )}
              </span>
            </div>
          }
        />

        <Stat
          className="col-span-3 lg:col-span-1"
          title="Investment"
          icon={
            <CurrencyDollarIcon className="w-6 h-6 text-white dark:text-gray-900" />
          }
          value={formatCurrency(
            totalInvestment,
            state.selectedBot.destination_currency
          )}
          description={
            <>
              {formatCurrency(
                state.selectedBot.origin_currency_amount,
                state.selectedBot.destination_currency
              )}{" "}
              every {state.selectedBot.investing_interval}{" "}
              {state.selectedBot.investing_interval > 1
                ? `${state.selectedBot.interval_type}s`
                : state.selectedBot.interval_type}
            </>
          }
        />

        <Stat
          className="col-span-3 lg:col-span-1"
          title="Balance on exchange"
          icon={
            <SwitchHorizontalIcon className="w-6 h-6 text-white dark:text-gray-900" />
          }
          value={formatCurrency(
            baseCurrencyBalance,
            state.selectedBot.destination_currency
          )}
          description={
            hasBalance ? (
              `Enough for ${kFormatter(durationEstimate)} more ${
                state.selectedBot.interval_type
              }s`
            ) : (
              <span className="text-red-400">Insufficient for next order</span>
            )
          }
        />

        <Stat
          className="col-span-3 lg:col-span-1"
          title="Current price"
          icon={<CashIcon className="w-6 h-6 text-white dark:text-gray-900" />}
          value={formatCurrency(
            parseInt(priceNow),
            state.selectedBot.destination_currency
          )}
          description={state.selectedBot.available_exchange.label}
        />

        <Stat
          className="col-span-3 lg:col-span-1"
          title="Average cost"
          icon={
            <PresentationChartLineIcon className="w-6 h-6 text-white dark:text-gray-900" />
          }
          value={formatCurrency(
            parseInt(averageCost),
            state.selectedBot.destination_currency
          )}
          description={`Difference ${formatCurrency(
            priceNow - averageCost,
            state.selectedBot.destination_currency
          )}`}
        />

        <Stat
          className="col-span-3 lg:col-span-1"
          title="Next order"
          icon={<ClockIcon className="w-6 h-6 text-white dark:text-gray-900" />}
          value={diffUntilNextOrder()}
          description={`Last trade ${timeSinceLastOrder}`}
          progressBar={
            <NextOrderProgress
              previousOrder={lastOrder ? lastOrder.dateTime : new Date()}
              nextOrder={nextOrderDate}
            />
          }
        />
      </div>
    </>
  );
};

const NextOrderProgress = (props) => {
  const start = new Date(props.previousOrder);
  const end = new Date(props.nextOrder);
  const now = new Date();
  const p = Math.round(((now - start) / (end - start)) * 100) + "%";

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-full h-2 text-xs flex bg-gray-200 dark:bg-gray-700">
        <div
          style={{ width: p }}
          className="shadow-none rounded-full transition flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-br from-indigo-300 dark:from-yellow-400 to-indigo-600 dark:to-yellow-600"
        ></div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { state } = useDashboardContext();
  const getMyBots = useGetMyBots();

  const hasBots = getMyBots.data && getMyBots.data.length;

  const title = state.selectedBot ? (
    <>
      {state.selectedBot.available_exchange.identifier.toUpperCase()}:
      {state.selectedBot.trading_pair}
    </>
  ) : (
    "Dashboard"
  );

  const emptyState = getMyBots.isLoading ? (
    <div className="flex w-full h-screen items-center justify-center">
      <Loading />
    </div>
  ) : (
    <div className="w-full h-screen flex items-center justify-center">
      <div>
        <h3 className="mb-2 text-2xl font-semibold text-center">Welcome!</h3>
        <div className="mb-16 text-center">
          <div className="flex justify-center flex-col items-center">
            <span className="text-lg">
              Are you ready to create your first bot?
            </span>

            <div className="flex items-center justify-center mt-20">
              <EmptyIllustration className="w-1/2 h-1/2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="bg-gray-100 dark:bg-gray-800">
        <div className="lg:flex">
          <div className="w-12/12 lg:w-16 bg-gray-900 dark:bg-gray-900 border-r border-gray-800">
            <DashboardMenu />
          </div>
          <div className="w-12/12 lg:w-330 shadow-xl dark:border-gray-700 bg-white dark:bg-gray-900">
            <BotList />
          </div>
          <div className="w-12/12 p-8 flex-1">
            {state.selectedBot ? (
              <>
                <div className="flex justify-between items-center mb-8">
                  <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 dark:from-yellow-600 to-indigo-700 dark:to-yellow-400">
                    {title}
                  </h1>
                  <div className="flex items-center">
                    <BotStatus {...state.selectedBot} />
                    <span className="ml-4">
                      <RemoveButton />
                    </span>
                    <span className="ml-4">
                      <EditPopover />
                    </span>
                  </div>
                </div>
                <div className="shadow-xl border bg-white dark:bg-gray-900 dark:border-gray-800 rounded-lg p-6 mb-8">
                  <h2 className="mb-4 text-lg font-medium">
                    Asset performance over time
                  </h2>
                  <div className="h-80">
                    <DashboardChart />
                  </div>
                </div>
                <div className="mb-10">
                  <ChartInfo />
                </div>

                <div className="shadow-xl border dark:border-gray-800 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <h2 className="text-xl font-medium mb-8 p-6">Your orders</h2>
                  <div>
                    <OrdersDataTable />
                  </div>
                </div>
              </>
            ) : (
              <div>
                <div>{!hasBots && emptyState}</div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Banner />
    </DashboardLayout>
  );
};

export default Dashboard;
