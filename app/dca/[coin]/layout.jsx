import InputFormWrapper from "../../../components/InputForm/InputForm";
import { cache, cloneElement } from "react";

import { getAllCoins } from "../../../queries/queries";
import Footer from "../../../components/Footer/Footer";
import { generateDefaultInput } from "../../../common/generateDefaultInput";
import dynamic from "next/dynamic";
import Loading from "../../../components/Loading/Loading";
import Navigation from "../../../components/Navigarion/Navigation";
import "@tremor/react/dist/esm/tremor.css";

import DcaCCGuides from "../../../components/CoinPage/DcaCCGuides";

const DynamicAffiliateLinks = dynamic(
  () => import("../../../components/AffiliateLinks/AffiliateLinks"),
  {
    ssr: false,
    loading: () => <Loading withWrapper />,
  }
);

const getContent = cache(async () => {
  const content = require(`../../../content/guides/usage-guide.md`);

  return content;
});

const getAvailableTokens = cache(async () => {
  const availableTokens = await getAllCoins();

  return availableTokens;
});

const CoinWrapper = async ({ params, searchParams, children }) => {
  const payload = generateDefaultInput({ ...searchParams, coin: params.coin });

  const [content, availableTokens] = await Promise.all([
    getContent(),
    getAvailableTokens(),
  ]);

  return (
    <>
      <Navigation />
      <div className="lg:flex bg-gray-100 dark:bg-gray-800">
        <div className="w-12/12 lg:w-330 md:border-r dark:border-gray-700 bg-white dark:bg-gray-900">
          <div>
            <InputFormWrapper
              availableTokens={availableTokens}
              {...payload}
              pathname="/dca/"
            />
          </div>
          <div className="mt-0 md:mt-8 hidden md:block">
            <DynamicAffiliateLinks />
          </div>
        </div>
        <div className="w-12/12 pt-4 md:mt-0 md:p-6 flex-1">
          {children}
          <div>
            <div className="mt-6">
              <DcaCCGuides content={content} />
            </div>
          </div>
        </div>
      </div>
      <div className="border-t dark:border-gray-700">
        <Footer availableTokens={availableTokens} />
      </div>
    </>
  );
};

export default CoinWrapper;
