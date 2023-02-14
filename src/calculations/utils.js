import { generateDCAResponse } from "./dca";
import { generateLumpSumResponse } from "./lumpsum";
import qs from "qs";
import { WEBSITE_PATHNAME } from "../../config";
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

  return { dca, lumpSum, input: innn };
};

export const getTableDcaDataPerCoin = ({ coinData, input }) => {
  const innn = { ...input };
  const rawData = stripDataBeforeAndAfter(
    coinData,
    input.dateFrom,
    input.dateTo
  );

  delete innn.session;

  const dca = generateDCAResponse({ response: [...rawData], payload: innn });

  delete dca.chartData;

  return { dca, input: innn };
};

export const getTableChartDataOverYears = (coinData, coin, years) => {
  const payload = {
    investment: 100,
    investmentInterval: 7,
    currency: "usd",
    coinId: coin.id,
  };

  const percentualDifferences = [];

  const response = years.map((year) => {
    const strippedData = stripDataBeforeAndAfter(
      coinData,
      `${year}-01-01`,
      `${year}-12-31`
    );

    payload.dateFrom = `${year}-01-01`;
    payload.dateTo = `${year}-12-31`;

    if (!strippedData.length) {
      return {
        year,
        coin,
        input: payload,
        url: `${WEBSITE_PATHNAME}/dca/${coin.id}?${qs.stringify(payload)}`,
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
      coin,
      input: payload,
      url: `${WEBSITE_PATHNAME}/dca/${coin.id}?${query}`,
      insights: dcaResponse.insights,
    };
  });

  return response;
};
