/* eslint-disable react/function-component-definition */
import { Block } from "@tremor/react";
import { useQuery } from "react-query";
import { getLumpSumChartData } from "../../../queries/queries";
import { useAppContext } from "../../Context/Context";
import Loading from "../../Loading/Loading";
import LumpSumCoinChart from "./LumpSumCoinChart";
import LumpSumCoinTable from "./LumpSumCoinTable";
import LumpSumTopCards from "./LumpSumTopCards";

export default function LumpSumPage() {
  const { state } = useAppContext();

  const investment =
    state.chart.data.length * parseFloat(state.input.investment);

  const input = { ...state.input, investment };

  const chartData = useQuery({
    queryFn: () => getLumpSumChartData(input),
    queryKey: JSON.stringify(input),
  });

  if (!chartData.data) {
    return (
      <div className="p-8">
        <Loading withWrapper width={20} height={20} />
      </div>
    );
  }

  return (
    <>
      <LumpSumTopCards chartData={chartData.data} />

      <Block marginTop="mt-6">
        <LumpSumCoinChart chartData={chartData.data} />
      </Block>

      <Block marginTop="mt-6">
        <LumpSumCoinTable chartData={chartData.data} />
      </Block>
    </>
  );
}
