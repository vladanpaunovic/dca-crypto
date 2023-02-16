import React from "react";
import { AppContextProvider } from "../components/Context/Context";
import Footer from "../components/Footer/Footer";
import { CACHE_INVALIDATION_INTERVAL } from "../config";
import { NextSeo } from "next-seo";
import NavigationMenu from "../components/Menu/Menu";
import { generateDefaultInput } from "../common/generateDefaultInput";
import dayjs from "dayjs";
import AllCoinsTable from "../components/AllCoinsTable/AllCoinsTable";
import { getServerSession } from "next-auth";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import { getCommonChartData } from "../server/serverQueries";
import { getGeneratedChartData } from "../src/calculations/utils";
import prismaClient from "../server/prisma/prismadb";

export async function getServerSideProps(context) {
  const today = dayjs().format("YYYY-MM-DD");
  const before5Years = dayjs(today).subtract(5, "year").format("YYYY-MM-DD");
  const payload = generateDefaultInput({
    coin: "bitcoin",
    dateFrom: before5Years,
    dateTo: today,
    investment: 10,
  });

  const session = await getServerSession(context.req, context.res, authOptions);

  const [bigKeyValueStore, chartData] = await Promise.all([
    prismaClient.bigKeyValueStore.findUnique({
      where: { key: "availableTokens" },
    }),
    getCommonChartData({
      ...payload,
      session,
    }),
  ]);

  const generatedChartData = getGeneratedChartData({
    data: chartData.prices,
    input: payload,
  });

  context.res.setHeader(
    "Cache-Control",
    `s-maxage=${CACHE_INVALIDATION_INTERVAL}, stale-while-revalidate`
  );

  return {
    props: {
      availableTokens: bigKeyValueStore.value,
      chartData: generatedChartData.dca,
    },
  };
}

export default function HomeWrapper(props) {
  return (
    <AppContextProvider availableTokens={props.availableTokens}>
      <Home {...props} />
    </AppContextProvider>
  );
}

function Home(props) {
  return (
    <div className="w-full">
      <NextSeo
        title=" DCA and Lump Sum Investment Calculator"
        description="Calculate your returns with dollar cost averaging or lump sum investing, the perfect tool for cryptocurrency investors"
      />
      <main className="w-full bg-white">
        <NavigationMenu availableTokens={props.availableTokens} />
        <section className="mx-auto p-8 primary-gradient text-center">
          <div className="container max-w-4xl mx-auto">
            <p className="text-center text-xl md:text-3xl text-gray-200">
              Invest smarter with our tools
            </p>
            <h1 className="h1-title text-4xl md:text-7xl text-center mb-4 text-white">
              Automatic DCA Calculator and Lump Sum Investment Calculator
            </h1>
            <p className="text-center text-xl md:text-3xl text-gray-200">
              Calculate your returns with dollar cost averaging or lump sum
              investing, the perfect tool for cryptocurrency investors.
            </p>
          </div>
        </section>

        <div className="container mx-auto max-w-3xl bg-white mt-16 mb-8 md:p-8">
          <div className="mb-16 px-6 md:px-0">
            <h2 className="text-base text-indigo-500 text-center font-semibold tracking-wide uppercase">
              DCA Calculator
            </h2>
            <p className="mt-2 text-3xl text-center leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Calculate DCA for your favorite coins
            </p>
          </div>
          <div className="">
            <AllCoinsTable
              showOnlyNTokens={10}
              showSearch={false}
              type="dca"
              availableTokens={props.availableTokens}
            />
          </div>
        </div>

        <div className="container mx-auto max-w-3xl bg-white mt-16 mb-8 md:p-8">
          <div className="mb-16 px-6 md:px-0">
            <h2 className="text-base text-center text-indigo-500 font-semibold tracking-wide uppercase">
              Lump Sum Calculator
            </h2>
            <p className="mt-2 text-center text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Calculate Lump Sum investments for your favorite coins
            </p>
          </div>
          <div className="pr-4">
            <AllCoinsTable showOnlyNTokens={10} showSearch={false} />
          </div>
        </div>
      </main>

      <Footer availableTokens={props.availableTokens} />
    </div>
  );
}
