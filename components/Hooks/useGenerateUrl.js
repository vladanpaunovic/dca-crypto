import { useRouter } from "next/navigation";
import { useStore } from "../../src/store/store";

const useGenerateUrl = () => {
  const state = useStore();

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
