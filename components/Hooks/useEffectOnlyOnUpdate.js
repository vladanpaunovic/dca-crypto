import { useEffect, useRef } from "react";

const useEffectOnlyOnUpdate = (callback, dependencies) => {
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      return callback();
    }

    // eslint-disable-next-line
  }, dependencies);
};

export default useEffectOnlyOnUpdate;
