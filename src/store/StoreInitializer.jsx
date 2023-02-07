import { useAppState } from "./store";
import { useRef } from "react";

function StoreInitializer(props) {
  const initialized = useRef(false);

  if (!initialized.current) {
    useAppState.setState(props);
    initialized.current = true;
  }

  return null;
}

export default StoreInitializer;
