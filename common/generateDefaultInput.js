import dayjs from "dayjs";
import { defaultCurrency } from "../config";

export const calculateDateRangeDifference = (dateFrom, dateTo) => {
  const date1 = dayjs(dateFrom);
  const date2 = dayjs(dateTo);
  return date2.diff(date1, "day");
};

export const availableInvestmentIntervals = [
  { label: "Daily", value: "1" },
  { label: "Weekly", value: "7" },
  { label: "Bi-weekly", value: "14" },
  { label: "Monthly", value: "30" },
];

export const generateDefaultInput = (query) => {
  const dateTo = query.dateTo || dayjs().format("YYYY-MM-DD");
  const dateFrom =
    query.dateFrom || dayjs(dateTo).subtract(91, "day").format("YYYY-MM-DD");

  const DEFAULT_INPUT = {
    coinId: query.coin || null,
    investment: query.investment || 100,
    investmentInterval:
      query.investmentInterval || availableInvestmentIntervals[1].value,
    dateFrom,
    dateTo,
    duration: calculateDateRangeDifference(dateFrom, dateTo),
    isLoading: false,
    currency: query.currency || defaultCurrency,
  };

  return DEFAULT_INPUT;
};
