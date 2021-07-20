import { useEffect, useRef } from "react";

const useEffectOnlyOnUpdate = (callback, dependencies) => {
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      return callback();
    }
  }, dependencies);
};

export default useEffectOnlyOnUpdate;
