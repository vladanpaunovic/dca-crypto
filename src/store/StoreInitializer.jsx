"use client";
import { useStore } from "./store";
import { useRef } from "react";

// {input, chartData, currentCoin, availableTokens}
function StoreInitializer(props) {
  const initialized = useRef(false);

  if (!initialized.current) {
    useStore.setState(props);
    initialized.current = true;
  }

  return null;
}

export default StoreInitializer;
