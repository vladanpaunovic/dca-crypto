import { WEBSITE_URL } from "../../../config";
import { NextSeo } from "next-seo";
import { formatPrice } from "../../../components/Currency/Currency";
import dayjs from "dayjs";
import ErrorComponent from "../../../components/Error/Error";
import "@tremor/react/dist/esm/tremor.css";
import CoinPage from "../../../components/CoinPage/CoinPage";
import CoinHeader from "../../../components/CoinPage/Header/Header";
// import Limit from "../../../components/Limit/Limit";

import { generateDCAResponse } from "../../../pages/api/calculate/dca";
import { generateLumpSumResponse } from "../../../pages/api/calculate/lump-sum";
import { setCookie } from "cookies-next";
import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../pages/api/auth/[...nextauth]";
import { canUserProceed, storeFingerprint } from "../../../server/redis";
import { convertDateStringToUnix } from "../../../src/utils";
import { FINGERPRING_ID } from "../../../common/fingerprinting";
import { generateDefaultInput } from "../../../common/generateDefaultInput";
import { cache } from "react";
import qs from "query-string";
import StoreInitializer from "../../../src/store/StoreInitializer";
import { notFound } from "next/navigation";
import { getAllCoins } from "../../../queries/queries";

export async function handleFingerprint() {
  const nextCookies = cookies();
  const fingerprint = nextCookies.get(FINGERPRING_ID)?.value;
  const session = await getServerSession(authOptions);

  let canProceed = { proceed: true };

  if (fingerprint) {
    setCookie(FINGERPRING_ID, fingerprint, {
      secure: true,
      maxAge: 3600 * 24,
      sameSite: "lax",
    });

    canProceed = await canUserProceed(fingerprint, session);
    if (canProceed.proceed) {
      storeFingerprint(fingerprint);
    }
  }

  return canProceed;
}

export const getData = cache(async (payload, canProceed) => {
  const query = qs.stringify({
    from: convertDateStringToUnix(payload.dateFrom),
    to: convertDateStringToUnix(payload.dateTo),
    vs_currency: payload.currency,
  });

  const response = await fetch(
    `https://api.coingecko.com/api/v3/coins/${payload.coinId}/market_chart/range?${query}`
  );

  const coinGeckoResponse = await response.json();

  const dca = generateDCAResponse({
    response: coinGeckoResponse,
    payload,
    canProceed,
  });

  const lumpSum = generateLumpSumResponse({
    response: coinGeckoResponse,
    payload,
    canProceed,
    investmentCount: dca.chartData.length,
  });

  return { dca, lumpSum, canProceed, input: payload };
});

const getCurrentCoin = cache(async (coinId) => {
  let currentCoin;
  let output;

  try {
    const query = qs.stringify({
      tickers: false,
      community_data: false,
      developer_data: false,
      localization: false,
    });
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coinId}?${query}}`
    );

    currentCoin = await response.json();

    output = {
      ...currentCoin,
      image: currentCoin.image.thumb,
    };
  } catch (error) {
    output = null;
  }

  if (!currentCoin) {
    return notFound();
  }

  return output;
});

const Coin = async (props) => {
  const availableTokens = await getAllCoins();

  const {
    params: { coin },
    searchParams,
  } = props;

  const payload = generateDefaultInput({ ...searchParams, coin });
  const canProceed = await handleFingerprint();

  const [currentCoin, chart] = await Promise.all([
    getCurrentCoin(coin),
    getData({ ...payload, coinId: coin }, canProceed),
  ]);

  if (!currentCoin) {
    return null;
  }

  const coinSymbol = currentCoin.symbol.toUpperCase();

  if (chart.error) {
    return <ErrorComponent error={chart.error} />;
  }

  if (!chart.canProceed.proceed) {
    // return <Limit canProceed={state.chart.canProceed} />;
  }

  return (
    <div className="w-full">
      <StoreInitializer
        availableTokens={availableTokens}
        input={payload}
        currentCoin={currentCoin}
        chart={chart}
      />
      <NextSeo
        useAppDir
        title={`Dollar cost average ${currentCoin.name} (${coinSymbol}) calculator`}
        description={`Visualise and calculate historical returns of investing ${formatPrice(
          chart.input.investment
        )} in ${currentCoin.name} (${coinSymbol}) every ${
          chart.input.investmentInterval
        } days from ${dayjs(chart.input.dateFrom).format(
          "MMM YYYY"
        )} until now. See it on charts!`}
        canonical={`https://${WEBSITE_URL}/dca/${currentCoin.id}`}
        openGraph={{
          title: `Dollar cost average ${coinSymbol} calculator`,
          description: `Visualise and calculate historical returns of investing ${formatPrice(
            chart.input.investment
          )} in ${coinSymbol} every ${
            chart.input.investmentInterval
          } days from ${dayjs(chart.input.dateFrom).format(
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
        <CoinHeader currentCoin={currentCoin} input={payload} />
        <CoinPage />
        <div className="mt-6" data-testid="what-is-this-coin">
          <h3 className="font-bold">What is {currentCoin.name}?</h3>

          <div className="mt-4 prose prose-sm max-w-none">
            <div
              dangerouslySetInnerHTML={{
                __html: currentCoin.description.en,
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Coin;
