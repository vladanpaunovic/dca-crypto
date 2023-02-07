import {
  Card,
  ColGrid,
  Text,
  Tab,
  TabList,
  Block,
  Col,
  Title,
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@tremor/react";
import { useState } from "react";
import BreadcrumbDCA from "../Breadcrumb/BreadcrumbDCA";
import CoinChart from "./CoinChart";
import TopCards from "./TopCards";
import { formatPrice } from "../Currency/Currency";
import dayjs from "dayjs";
import CalloutPerformance from "./CalloutPerformance";
import CardCurrentCoin from "./CardCurrentCoin";
import CoinTracked from "./CoinTracked";
import dynamic from "next/dynamic";
import Loading from "react-loading";
import DcaCCGuides from "./DcaCCGuides";
import { useAppState } from "../../src/store/store";

const DynamicLumpSumPage = dynamic(() => import("./LumpSum/LumpSumPage"), {
  ssr: false,
  loading: () => (
    <div className="h-screen">
      <Loading withWrapper />
    </div>
  ),
});

const DynamicCoinTable = dynamic(() => import("./CoinTable"), {
  ssr: false,
});

export default function CoinPage({ currentCoin, coinSymbol, content }) {
  const [selectedView, setSelectedView] = useState(1);
  const state = useAppState();

  const description = `Visualise and calculate historical returns of investing ${formatPrice(
    state.chart.input.investment
  )} in ${coinSymbol} every ${
    state.chart.input.investmentInterval
  } days from ${dayjs(state.chart.input.dateFrom).format(
    "MMM YYYY"
  )} until now`;

  return (
    <main>
      <ColGrid numColsSm={1} numColsLg={3} gapX="gap-x-6" gapY="gap-y-6">
        <Col numColSpan={1} numColSpanLg={2}>
          <div className="px-4 md:px-0">
            <div className="flex items-center">
              <h1 className="text-gray-900 text-lg font-medium ">
                Dollar-cost averaging (DCA) calculator for{" "}
                <span className="text-indigo-700 dark:text-yellow-500 capitalize">
                  {currentCoin.name} ({coinSymbol})
                </span>{" "}
                backtesting
              </h1>
            </div>
            <Text>{description}</Text>
          </div>
          <BreadcrumbDCA name={currentCoin.name} coinId={currentCoin.id} />
        </Col>
        <Col>
          <CardCurrentCoin />
        </Col>
      </ColGrid>
      <TabList
        defaultValue={1}
        handleSelect={(value) => setSelectedView(value)}
        marginTop="mt-2"
        color="indigo"
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
            <CalloutPerformance />
          </Block>

          <div data-testid="profit-loss-interval">
            <Card marginTop="mt-6">
              <CoinTracked />
            </Card>
          </div>

          <Block marginTop="mt-6">
            <Accordion expanded={false} shadow={true} marginTop="mt-0">
              <AccordionHeader>
                <span className="text-gray-900">Purchase history</span>
              </AccordionHeader>
              <DynamicCoinTable />
              <AccordionBody></AccordionBody>
            </Accordion>
          </Block>
        </>
      )}

      {selectedView === 2 && <DynamicLumpSumPage />}

      <div data-testid="what-is-this-coin">
        <Card marginTop="mt-6">
          <Title>What is {currentCoin.name}?</Title>

          <div className="mt-4 prose prose-sm max-w-none">
            <div
              dangerouslySetInnerHTML={{ __html: currentCoin.description.en }}
            />
          </div>
        </Card>
      </div>

      <Block marginTop="mt-6">
        <DcaCCGuides content={content} />
      </Block>
    </main>
  );
}
