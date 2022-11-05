import { useAppContext } from "../Context/Context";
import { useRouter } from "next/router";

const useGenerateUrl = () => {
  const { state } = useAppContext();
  const router = useRouter();

  const payload = {
    investment: state.input.investment,
    investmentInterval: state.input.investmentInterval,
    dateFrom: state.input.dateFrom,
    dateTo: state.input.dateTo,
    duration: state.input.duration,
    currency: state.input.currency,
  };

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
