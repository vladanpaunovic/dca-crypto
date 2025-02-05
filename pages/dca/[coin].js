import InputFormWrapper from "../../components/InputForm/InputForm";
import {
  CACHE_INVALIDATION_INTERVAL,
  WEBSITE_PATHNAME,
  WEBSITE_URL,
} from "../../config";
import Footer from "../../components/Footer/Footer";
import { generateDefaultInput } from "../../src/generateDefaultInput";
import { NextSeo } from "next-seo";
import dynamic from "next/dynamic";
import Loading from "../../components/Loading/Loading";
import Navigation from "../../components/Navigarion/Navigation";
import ErrorComponent from "../../components/Error/Error";
import "@tremor/react/dist/esm/tremor.css";
import CoinPage from "../../components/CoinPage/CoinPage";
import Limit from "../../components/Limit/Limit";
import StoreInitializer from "../../src/store/StoreInitializer";
import { useAppState } from "../../src/store/store";
import { getGeneratedChartData } from "../../src/calculations/utils";
import ShareChart from "../../components/ShareChart/ShareChart";
import prismaClient from "../../server/prisma/prismadb";
import * as Sentry from "@sentry/nextjs";
import qs from "qs";
import { classNames } from "../../styles/utils";
import { useSession } from "next-auth/react";

const DynamicCalculationCounter = dynamic(
  () => import("../../components/Limit/CalculationCounter"),
  {
    ssr: false,
    loading: () => (
      <p className="text-gray-900 text-xs p-2 bg-gray-100 mb-4 rounded-lg">
        <b>Loading...</b>
      </p>
    ),
  }
);

const DynamicAffiliateLinks = dynamic(
  () => import("../../components/AffiliateLinks/AffiliateLinks"),
  {
    ssr: false,
    loading: () => (
      <div className="h-80">
        <Loading withWrapper width={20} />
      </div>
    ),
  }
);

// export async function getStaticPaths() {
//   const bigKeyValueStore = await prismaClient.bigKeyValueStore.findUnique({
//     where: { key: "availableTokens" },
//   });

//   const paths = bigKeyValueStore.value.slice(0, 10).map((token) => ({
//     params: { coin: token.id },
//   }));

//   return {
//     paths,
//     fallback: true,
//   };
// }

export async function getServerSideProps(context) {
  const coinId = context.params.coin || "bitcoin";

  const payload = generateDefaultInput(context.query);

  const queryString = qs.stringify(payload);

  const url = `${WEBSITE_PATHNAME}/dca/${coinId}?${queryString}`;

  Sentry.setContext("Reproducable URL", url);

  const [availableTokens, coinData] = await Promise.all([
    prismaClient.bigKeyValueStore.findUnique({
      where: { key: "availableTokens" },
    }),
    prismaClient.cryptocurrency.findUnique({
      where: { coinId },
    }),
  ]);

  const content = require(`../../content/guides/usage-guide.md`);

  if (!coinData) {
    return {
      notFound: true,
    };
  }

  const chart = getGeneratedChartData({
    data: [...coinData.prices],
    input: payload,
  });

  context.res.setHeader(
    "Cache-Control",
    `s-maxage=${CACHE_INVALIDATION_INTERVAL}, stale-while-revalidate`
  );

  const output = {
    rawMarketData: [...coinData.prices],
    availableTokens: availableTokens.value,
    chart,
    currentCoin: { ...coinData, id: coinData.coinId },
    content,
    payload,
  };

  return {
    props: output,
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

  return (
    <div className="w-full">
      <NextSeo
        title={`DCA Calculator for ${state.currentCoin.name} (${coinSymbol}) | Visualise Crypto Investment Returns`}
        description={`Calculate historical returns with our crypto DCA calculator. Backtest ${state.currentCoin.name} and other cryptocurrencies with dollar-cost averaging investment strategies.`}
        canonical={`https://${WEBSITE_URL}/dca/${state.currentCoin.id}`}
        openGraph={{
          title: `Dollar cost average ${coinSymbol} calculator`,
          description: `Calculate historical returns with our crypto DCA calculator. Backtest ${state.currentCoin.name} and other cryptocurrencies with dollar-cost averaging investment strategies.`,
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
  const state = useAppState();
  const session = useSession();

  if (!state.canProceed.proceed) {
    return (
      <>
        {session.data?.user && <Navigation />}
        <div className="container mx-auto p-4">
          <Limit canProceed={state.canProceed} />
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="lg:flex bg-gray-100">
        <div
          className={classNames(
            !state.canProceed.proceed ? "blur-2xl pointer-events-none" : "",
            "w-12/12 lg:w-330 md:border-r bg-white transition-all duration-300"
          )}
        >
          <div className="px-4 pt-2">
            <InputFormWrapper {...props} pathname="/dca/" />
          </div>
          <div className="mt-0 md:block px-4">
            <ShareChart />
          </div>
          <div className="mt-4 px-4">
            <div className="pb-2 md:pb-0">
              <DynamicCalculationCounter />
            </div>
          </div>
          <div className="m-0 hidden md:block">
            <DynamicAffiliateLinks />
          </div>
        </div>
        <div className="w-12/12 pt-4 md:mt-0 md:p-6 flex-1">
          <Coin content={props.content} />
        </div>
      </div>
      <div className="border-t">
        <Footer availableTokens={props.availableTokens} />
      </div>
    </>
  );
};

const PageWrapper = (props) => {
  return (
    <>
      <StoreInitializer
        availableTokens={props.availableTokens}
        chart={props.chart}
        rawMarketData={props.rawMarketData}
        currentCoin={props.currentCoin}
        input={props.payload}
      />
      <CoinWrapper {...props} />
    </>
  );
};

export default PageWrapper;
