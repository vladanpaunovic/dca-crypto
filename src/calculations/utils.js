import { generateDCAResponse } from "./dca";
import { generateLumpSumResponse } from "./lumpsum";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { WEBSITE_PATHNAME } from "../../config";
import qs from "qs";

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

  return { dca, lumpSum, input: innn };
};

export const getTableChartDataOverYears = (coinData, years) => {
  const payload = {
    investment: 100,
    investmentInterval: 7,
    currency: "usd",
    coinId: coinData.coinId,
  };

  const percentualDifferences = [];

  const response = years.map((year) => {
    payload.dateFrom = `${year}-01-01`;
    payload.dateTo = `${new Date().getFullYear()}-12-31`;

    const strippedData = stripDataBeforeAndAfter(
      coinData.prices,
      payload.dateFrom,
      payload.dateTo
    );

    if (!strippedData.length) {
      return {
        year,
        coin: coinData,
        input: payload,
        url: `${WEBSITE_PATHNAME}/dca/${coinData.coinId}?${qs.stringify(
          payload
        )}`,
        insights: {
          percentageChange: 0,
        },
      };
    }

    const dcaResponse = generateDCAResponse({
      response: [...strippedData],
      payload,
    });

    delete dcaResponse.chartData;

    const query = qs.stringify(payload);

    percentualDifferences.push(dcaResponse.insights.percentageChange);

    return {
      year,
      coin: coinData,
      input: payload,
      url: `${WEBSITE_PATHNAME}/dca/${coinData.coinId}?${query}`,
      insights: dcaResponse.insights,
    };
  });

  return response;
};
