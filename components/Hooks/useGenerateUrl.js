import { useAppContext } from "../Context/Context";
import { useRouter } from "next/router";

const useGenerateUrl = (method) => {
  const { state } = useAppContext();
  const router = useRouter();

  let payload;

  switch (method) {
    case "lump-sum":
      const { investment, dateFrom, currency } = state.input;
      payload = { investment, dateFrom, currency };
      break;
    case "dca":
      const { coinId, ...rest } = state.input;
      payload = rest;
      break;
    default:
      break;
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
