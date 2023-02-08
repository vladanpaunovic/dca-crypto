import { generateDCAResponse } from "./dca";
import { generateLumpSumResponse } from "./lumpsum";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);

export const stripDataBeforeAndAfter = (data, dateFrom, dateTo) => {
  const output = data.filter((item) => {
    const date = new Date(item[0]);
    const isBetweenRange = dayjs(date).isBetween(dateFrom, dateTo);

    return isBetweenRange;
  });

  return output;
};

export const getGeneratedChartData = ({ data, input }) => {
  const innn = { ...input };
  const rawData = stripDataBeforeAndAfter(data, input.dateFrom, input.dateTo);

  delete innn.session;
  const dca = generateDCAResponse({ response: [...rawData], payload: innn });
  const lumpSum = generateLumpSumResponse({
    response: [...rawData],
    payload: innn,
    investmentCount: dca.chartData.length,
  });

  return { dca, lumpSum, canProceed: { proceed: true }, input: innn };
};
