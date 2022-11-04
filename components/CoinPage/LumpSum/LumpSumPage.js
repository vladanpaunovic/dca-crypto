/* eslint-disable react/function-component-definition */
import { Block } from "@tremor/react";
import { useAppContext } from "../../Context/Context";
import LumpSumCoinChart from "./LumpSumCoinChart";
import LumpSumCoinTable from "./LumpSumCoinTable";
import LumpSumTopCards from "./LumpSumTopCards";

export default function LumpSumPage() {
  const { state } = useAppContext();

  const chartData = state.chart.lumpSum;

  return (
    <>
      <LumpSumTopCards chartData={chartData} />

      <Block marginTop="mt-6">
        <LumpSumCoinChart chartData={chartData} />
      </Block>

      <Block marginTop="mt-6">
        <LumpSumCoinTable chartData={chartData} />
      </Block>
    </>
  );
}
