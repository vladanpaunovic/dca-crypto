import InputFormWrapper from "../../components/InputForm/InputForm";
import {
  AppContextProvider,
  useAppContext,
} from "../../components/Context/Context";
import {
  getAllCoins,
  getCoinById,
  getCommonChartData,
} from "../../queries/queries";
import {
  // CACHE_INVALIDATION_INTERVAL,
  defaultCurrency,
  WEBSITE_URL,
} from "../../config";
import Footer from "../../components/Footer/Footer";
import { generateDefaultInput } from "../../common/generateDefaultInput";
import { NextSeo } from "next-seo";
import dynamic from "next/dynamic";
import Loading from "../../components/Loading/Loading";
import { formatPrice } from "../../components/Currency/Currency";
import dayjs from "dayjs";
import Navigation from "../../components/Navigarion/Navigation";
import { getCookie } from "cookies-next";
import { FINGERPRING_ID } from "../../common/fingerprinting";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import ErrorComponent from "../../components/Error/Error";
import "@tremor/react/dist/esm/tremor.css";
import CoinPage from "../../components/CoinPage/CoinPage";
import Limit from "../../components/Limit/Limit";

const DynamicAffiliateLinks = dynamic(
  () => import("../../components/AffiliateLinks/AffiliateLinks"),
  {
    ssr: false,
    loading: () => <Loading withWrapper />,
  }
);

export async function getServerSideProps(context) {
  const currency = context.query.currency || defaultCurrency;

  const fingerprint = getCookie(FINGERPRING_ID, {
    req: context.req,
    res: context.res,
  });

  const payload = generateDefaultInput(context.query);

  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  const [availableTokens, chart, currentCoin] = await Promise.all([
    getAllCoins(currency), // TODO: REMOVE
    getCommonChartData({
      ...payload,
      session,
      ...(fingerprint ? { fingerprint } : {}),
    }),
    getCoinById(payload.coinId),
  ]);

  return {
    props: {
      availableTokens,
      chart,
      currentCoin,
      ...payload,
    },
  };
}

const Coin = () => {
  const { state } = useAppContext();

  if (!state.currentCoin) {
    return null;
  }

  const coinSymbol = state.currentCoin.symbol.toUpperCase();

  if (state.chart.error) {
    return <ErrorComponent error={state.chart.error} />;
  }

  if (!state.chart.canProceed.proceed) {
    return <Limit canProceed={state.chart.canProceed} />;
  }

  return (
    <div className="w-full">
      <NextSeo
        title={`Dollar cost average ${state.currentCoin.name} (${coinSymbol}) calculator`}
        description={`Visualise and calculate historical returns of investing ${formatPrice(
          state.chart.input.investment
        )} in ${state.currentCoin.name} (${coinSymbol}) every ${
          state.chart.input.investmentInterval
        } days from ${dayjs(state.chart.input.dateFrom).format(
          "MMM YYYY"
        )} until now. See it on charts!`}
        canonical={`https://${WEBSITE_URL}/dca/${state.currentCoin.id}`}
        openGraph={{
          title: `Dollar cost average ${coinSymbol} calculator`,
          description: `Visualise and calculate historical returns of investing ${formatPrice(
            state.chart.input.investment
          )} in ${coinSymbol} every ${
            state.chart.input.investmentInterval
          } days from ${dayjs(state.chart.input.dateFrom).format(
            "MMM YYYY"
          )} until now. See it on charts!`,
          images: [
            {
              url: `https://${WEBSITE_URL}/images/meta-open-graph-dca.jpg`,
              width: 1200,
              height: 697,
              alt: "Dollar cost averaging calculator",
            },
          ],
        }}
      />
      <main>
        <CoinPage currentCoin={state.currentCoin} coinSymbol={coinSymbol} />
      </main>
    </div>
  );
};

const CoinWrapper = (props) => {
  return (
    <AppContextProvider
      availableTokens={props.availableTokens}
      chart={props.chart}
      currentCoin={props.currentCoin}
    >
      <Navigation />
      <div className="lg:flex bg-gray-100 dark:bg-gray-800">
        <div className="w-12/12 lg:w-330 md:border-r dark:border-gray-700 bg-white dark:bg-gray-900">
          <div>
            <InputFormWrapper {...props} pathname="/dca/" />
          </div>
          <div className="mt-0 md:mt-8 hidden md:block">
            <DynamicAffiliateLinks />
          </div>
        </div>
        <div className="w-12/12 pt-4 md:mt-0 md:p-6 flex-1">
          <Coin />
        </div>
      </div>
      <div className="border-t dark:border-gray-700">
        <Footer availableTokens={props.availableTokens} />
      </div>
    </AppContextProvider>
  );
};

export default CoinWrapper;
