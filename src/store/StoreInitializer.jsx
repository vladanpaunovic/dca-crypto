import { useAppState } from "./store";
import { useRef } from "react";

function StoreInitializer(props) {
  const initialized = useRef(false);

  const propsAsString = JSON.stringify(props);

  if (!initialized.current || initialized.current !== propsAsString) {
    useAppState.setState(props);
    initialized.current = propsAsString;
    return null;
  }

  return null;
}

export default StoreInitializer;
