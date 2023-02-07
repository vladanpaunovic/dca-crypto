"use client";

import { Tab, TabList } from "@tremor/react";
import { useState } from "react";
import dynamic from "next/dynamic";
import Loading from "react-loading";

const DynamicDCAPage = dynamic(() => import("./DCA/DcaPage"), {
  ssr: false,
  loading: () => (
    <div className="h-screen">
      <Loading withWrapper />
    </div>
  ),
});

const DynamicLumpSumPage = dynamic(() => import("./LumpSum/LumpSumPage"), {
  ssr: false,
  loading: () => (
    <div className="h-screen">
      <Loading withWrapper />
    </div>
  ),
});

export default function CoinPage() {
  const [selectedView, setSelectedView] = useState(1);

  return (
    <main>
      <TabList
        defaultValue={1}
        onValueChange={(value) => setSelectedView(value)}
        marginTop="mt-2"
        color="indigo"
      >
        <Tab value={1} text="Dollar Cost Average" />
        <Tab value={2} text="Lump Sum" />
      </TabList>

      {selectedView === 1 && <DynamicDCAPage />}

      {selectedView === 2 && <DynamicLumpSumPage />}
    </main>
  );
}
