import { useAppContext } from "../Context/Context";
import { useRouter } from "next/router";

const useGenerateUrl = (method) => {
  const { state } = useAppContext();
  const router = useRouter();

  let payload;

  switch (method) {
    case "lump-sum": {
      const { investment, dateFrom, currency } = state.input;
      payload = { investment, dateFrom, currency };
      break;
    }
    case "dca": {
      payload = {
        investment: state.input.investment,
        investmentInterval: state.input.investmentInterval,
        dateFrom: state.input.dateFrom,
        dateTo: state.input.dateTo,
        duration: state.input.duration,
        currency: state.input.currency,
      };
      break;
    }
    default: {
      break;
    }
  }

  const generateUrl = () =>
    router.replace(
      {
        pathname: state.input.coinId,
        query: payload,
      },
      undefined,
      { shallow: true }
    );

  return generateUrl;
};

export default useGenerateUrl;
