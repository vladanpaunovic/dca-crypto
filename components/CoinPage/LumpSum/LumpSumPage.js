/* eslint-disable react/function-component-definition */
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  Block,
} from "@tremor/react";
import { useStore } from "../../../src/store/store";
import CalloutPerformance from "../CalloutPerformance";
import LumpSumCoinChart from "./LumpSumCoinChart";
import LumpSumCoinTable from "./LumpSumCoinTable";
import LumpSumTopCards from "./LumpSumTopCards";

export default function LumpSumPage() {
  const state = useStore();

  const chartData = state.chart.lumpSum;

  return (
    <>
      <LumpSumTopCards chartData={chartData} />

      <Block marginTop="mt-6">
        <LumpSumCoinChart chartData={chartData} />
      </Block>

      <Block marginTop="mt-6">
        <CalloutPerformance chartData={chartData} isLumpSum />
      </Block>

      <Block marginTop="mt-6">
        <Accordion expanded={false} shadow={true} marginTop="mt-0">
          <AccordionHeader>
            <span className="text-gray-900">Purchase history</span>
          </AccordionHeader>
          <LumpSumCoinTable chartData={chartData} />
          <AccordionBody></AccordionBody>
        </Accordion>
      </Block>
    </>
  );
}
