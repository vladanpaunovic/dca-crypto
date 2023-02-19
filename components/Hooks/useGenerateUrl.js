import { useRouter } from "next/router";
import { calculateDateRangeDifference } from "../../src/generateDefaultInput";
import { useAppState } from "../../src/store/store";

const useGenerateUrl = () => {
  const state = useAppState();
  const router = useRouter();

  const investmentDuration = calculateDateRangeDifference(
    state.input.dateFrom,
    state.input.dateTo
  );

  const payload = {
    investment: state.input.investment,
    investmentInterval: state.input.investmentInterval,
    dateFrom: state.input.dateFrom,
    dateTo: state.input.dateTo,
    duration: investmentDuration,
    currency: state.input.currency,
  };

  const generateUrl = () =>
    router.replace(
      {
        pathname: router.query.coin,
        query: payload,
      },
      undefined,
      { shallow: true }
    );

  return generateUrl;
};

export default useGenerateUrl;
