import { getCookie } from "cookies-next";
import { useSession } from "next-auth/react";
import { useQuery, useMutation } from "react-query";
import { FINGERPRING_ID } from "../../common/fingerprinting";
import { useAppState } from "../../src/store/store";
import { ACTIONS } from "../Context/mainReducer";
import { useDebounce } from "usehooks-ts";
import { useEffect } from "react";

const CalculationCounter = () => {
  const CALCULATION_QUERY_ID = "calculationCounter";
  const state = useAppState();
  const fingerprint = getCookie(FINGERPRING_ID);
  const session = useSession();

  const inputAsString = JSON.stringify(state.input);
  const debouncedInput = useDebounce(inputAsString, 3000);

  const mutation = useMutation(
    () => {
      return fetch(`/api/can-user-proceed/${fingerprint}`, {
        method: "POST",
      }).then((res) => res.json());
    },
    {
      onSuccess: async (data) => {
        state.dispatch({ type: ACTIONS.UPDATE_CAN_PROCEED, payload: data });
      },
    }
  );

  const calculationCounter = useQuery(
    CALCULATION_QUERY_ID,
    () => {
      return fetch(`/api/can-user-proceed/${fingerprint}`).then((res) =>
        res.json()
      );
    },
    {
      enabled: session.status !== "loading",
      onSuccess: (data) => {
        state.dispatch({ type: ACTIONS.UPDATE_CAN_PROCEED, payload: data });
      },
    }
  );

  useEffect(() => {
    if (fingerprint) {
      mutation.mutate();
    }
    // eslint-disable-next-line
  }, [debouncedInput, fingerprint]);

  if (calculationCounter.isLoading || session.isLoading) {
    return null;
  }

  const freeTierLimitReached = !state.canProceed.proceed;

  if (freeTierLimitReached) {
    return (
      <p className="text-yellow-900 text-xs p-2 bg-yellow-50 mb-4 rounded-lg">
        Free Limit Reached
      </p>
    );
  }

  if (state.canProceed.sessionUserCount) {
    return (
      <p className="text-gray-900 text-xs p-2 bg-gray-100 mb-4 rounded-lg">
        Used free calculations:{" "}
        <b>
          {state.canProceed.sessionUserCount} out of{" "}
          {calculationCounter.data.available}
        </b>
      </p>
    );
  }

  return null;
};

export default CalculationCounter;
