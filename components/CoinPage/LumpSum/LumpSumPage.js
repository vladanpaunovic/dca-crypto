/* eslint-disable react/function-component-definition */
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  Block,
} from "@tremor/react";
import { useAppState } from "../../../src/store/store";
import CalloutPerformance from "../CalloutPerformance";
import LumpSumCoinChart from "./LumpSumCoinChart";
import LumpSumCoinTable from "./LumpSumCoinTable";
import LumpSumTopCards from "./LumpSumTopCards";
import Blur from "../../Upgrade/blur";

export default function LumpSumPage() {
  const state = useAppState();

  const chartData = state.chart.lumpSum;

  return (
    <>
      <LumpSumTopCards chartData={chartData} />

      <Blur>
        <Block marginTop="mt-6">
          <LumpSumCoinChart chartData={chartData} />
        </Block>

        <Block marginTop="mt-6">
          <CalloutPerformance chartData={chartData} isLumpSum />
        </Block>

        <Block marginTop="mt-6">
          <Accordion expanded={true} shadow={true} marginTop="mt-0">
            <AccordionHeader>
              <span className="text-gray-900">Purchase history</span>
            </AccordionHeader>
            <LumpSumCoinTable chartData={chartData} />
            <AccordionBody></AccordionBody>
          </Accordion>
        </Block>
      </Blur>
    </>
  );
}
