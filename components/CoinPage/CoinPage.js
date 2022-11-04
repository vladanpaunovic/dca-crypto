import {
  Card,
  ColGrid,
  Text,
  Metric,
  Tab,
  TabList,
  Block,
  Col,
} from "@tremor/react";

import { useState } from "react";
import BreadcrumbDCA from "../Breadcrumb/BreadcrumbDCA";
import { useAppContext } from "../Context/Context";
import CoinChart from "./CoinChart";
import TopCards from "./TopCards";
import NextImage from "next/image";
import Currency, { formatPrice } from "../Currency/Currency";
import dayjs from "dayjs";
import CoinTable from "./CoinTable";
import LumpSumPage from "./LumpSum/LumpSumPage";

export default function CoinPage({ currentCoin, coinSymbol }) {
  const [selectedView, setSelectedView] = useState(1);
  const { state } = useAppContext();

  const description = `Visualise and calculate historical returns of investing ${formatPrice(
    state.input.investment
  )} in ${coinSymbol} every ${state.input.investmentInterval} days from ${dayjs(
    state.input.dateFrom
  ).format("MMM YYYY")} until now`;

  return (
    <main>
      <ColGrid numColsSm={1} numColsLg={3} gapX="gap-x-6" gapY="gap-y-6">
        <Col numColSpan={1} numColSpanLg={2}>
          <div className="px-4 md:px-0">
            <div className="flex items-center">
              <h1 className="text-lg font-medium ">
                Dollar-cost averaging (DCA) calculator for{" "}
                <span className="text-indigo-700 dark:text-yellow-500 capitalize">
                  {currentCoin.name} ({coinSymbol})
                </span>{" "}
                backtesting
              </h1>
              {state.input.isLoading ? null : (
                <div className="w-8 h-8 ml-2 hidden sm:block relative">
                  <NextImage
                    src={state.currentCoin.image}
                    alt={`${state.currentCoin.name} logo`}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
              )}
            </div>
            <Text>{description}</Text>
          </div>
          <BreadcrumbDCA name={currentCoin.name} coinId={currentCoin.id} />
        </Col>
        <Col>
          <Card>
            <Text>Total Investment</Text>

            <Metric>
              <Currency value={state.chart.insights.totalInvestment} />
            </Metric>
          </Card>
        </Col>
      </ColGrid>

      <TabList
        defaultValue={1}
        handleSelect={(value) => setSelectedView(value)}
        marginTop="mt-2"
      >
        <Tab value={1} text="Dollar Cost Average" />
        <Tab value={2} text="Lump Sum" />
      </TabList>

      {selectedView === 1 && (
        <>
          <TopCards />

          <Block marginTop="mt-6">
            <CoinChart />
          </Block>

          <Block marginTop="mt-6">
            <CoinTable />
          </Block>
        </>
      )}

      {selectedView === 2 && <LumpSumPage />}
    </main>
  );
}
