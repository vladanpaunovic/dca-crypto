import InputFormWrapper from "../../components/InputForm/InputForm";
import {
  getAllCoins,
  getCoinById,
  getCommonChartData,
} from "../../server/serverQueries";
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
import StoreInitializer from "../../src/store/StoreInitializer";
import { useAppState } from "../../src/store/store";
import { getGeneratedChartData } from "../../src/calculations/utils";
import { canUserProceed, storeFingerprint } from "../../server/redis";
import ShareChart from "../../components/ShareChart/ShareChart";

const DynamicAffiliateLinks = dynamic(
  () => import("../../components/AffiliateLinks/AffiliateLinks"),
  {
    ssr: false,
    loading: () => <Loading withWrapper />,
  }
);

export async function getServerSideProps(context) {
  const currency = context.query.currency || defaultCurrency;
  const coinId = context.query.coin || "bitcoin";

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

  const [availableTokens, rawMarketData, currentCoin, canProceed] =
    await Promise.all([
      getAllCoins(currency), // TODO: REMOVE
      getCommonChartData({
        ...payload,
        session,
        coinId,
        ...(fingerprint ? { fingerprint } : {}),
      }),
      getCoinById(coinId),
      canUserProceed(fingerprint, session),
    ]);

  if (canProceed.proceed) {
    storeFingerprint(fingerprint);
  }

  const content = require(`../../content/guides/usage-guide.md`);

  if (!currentCoin) {
    return {
      notFound: true,
    };
  }

  const chart = getGeneratedChartData({
    data: rawMarketData.prices,
    input: payload,
  });

  return {
    props: {
      rawMarketData,
      availableTokens,
      chart,
      currentCoin,
      content,
      ...payload,
      payload,
      canProceed,
    },
  };
}

const Coin = ({ content }) => {
  const state = useAppState();

  if (!state.currentCoin) {
    return null;
  }

  const coinSymbol = state.currentCoin.symbol.toUpperCase();

  if (state.chart.error) {
    return <ErrorComponent error={state.chart.error} />;
  }

  if (!state.canProceed.proceed) {
    return <Limit canProceed={state.canProceed} />;
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
        <CoinPage
          content={content}
          currentCoin={state.currentCoin}
          coinSymbol={coinSymbol}
        />
      </main>
    </div>
  );
};

const CoinWrapper = (props) => {
  return (
    <>
      <StoreInitializer
        availableTokens={props.availableTokens}
        chart={props.chart}
        rawMarketData={props.rawMarketData}
        currentCoin={props.currentCoin}
        input={props.payload}
        canProceed={props.canProceed}
      />
      <Navigation />
      <div className="lg:flex bg-gray-100 dark:bg-gray-800">
        <div className="w-12/12 lg:w-330 md:border-r dark:border-gray-700 bg-white dark:bg-gray-900">
          <div className="px-4 pt-2">
            <InputFormWrapper {...props} pathname="/dca/" />
          </div>
          <div className="mt-0 md:block px-4">
            <ShareChart />
          </div>
          <div className="mt-0 md:mt-8 hidden md:block">
            <DynamicAffiliateLinks />
          </div>
        </div>
        <div className="w-12/12 pt-4 md:mt-0 md:p-6 flex-1">
          <Coin content={props.content} />
        </div>
      </div>
      <div className="border-t dark:border-gray-700">
        <Footer availableTokens={props.availableTokens} />
      </div>
    </>
  );
};

export default CoinWrapper;
