import "@tremor/react/dist/esm/tremor.css";
import { getTableChartDataOverYears } from "../src/calculations/utils";
import DcaOverviewTable from "../components/DcaOverviewPage/DcaOverviewTable/DcaOverviewTable";
import { Subtitle, Title } from "@tremor/react";
import ReactMarkdown from "react-markdown";
import prismaClient from "../server/prisma/prismadb";
import DcaOverviewChart from "../components/DcaOverviewPage/DcaOverviewChart/DcaOverviewChart";
import Navigation from "../components/Navigarion/Navigation";
import Footer from "../components/Footer/Footer";

export const getStaticProps = async () => {
  const bigKeyValueStore = await prismaClient.bigKeyValueStore.findUnique({
    where: {
      key: "availableTokens",
    },
  });

  const top5coins = bigKeyValueStore.value
    .slice(0, 10)
    .map((coin) => coin.coinId);

  const coinPrices = await prismaClient.cryptocurrency.findMany({
    where: {
      coinId: {
        in: top5coins,
      },
    },
  });

  // create an array listing last 5 years
  const years = Array.from(
    { length: 8 },
    (_, i) => new Date().getFullYear() - i
  );

  const responses = coinPrices.map((coinData) => {
    return {
      years: getTableChartDataOverYears(coinData, years),
      coinId: coinData.coinId,
      coinLabel: coinData.name,
    };
  });

  const content = require(`../content/guides/dca-overview-table.md`);

  return {
    props: {
      tableData: responses,
      years,
      content,
      availableTokens: bigKeyValueStore.value,
    },
  };
};

const Page = (props) => {
  const subtitleYears = [...props.years]
    .reverse()
    .slice(0, props.years.length - 1)
    .join(", ");

  return (
    <div>
      <Navigation />
      <div className="container mx-auto p-8 text-gray-900 ">
        <Title>Dollar Cost Averaging (DCA) Returns</Title>
        <Subtitle>
          How much would you have earned if you purchased $100 every week since{" "}
          {subtitleYears}, or {props.years[0]}?
        </Subtitle>
        <div className="mt-8">
          <DcaOverviewTable {...props} />
        </div>
        <div className="mt-8">
          <DcaOverviewChart {...props} />
        </div>

        <div className="mt-8 flex justify-center">
          <div className="mt-4 max-w-3xl  prose prose-sm">
            <ReactMarkdown>{props.content.body}</ReactMarkdown>
          </div>
        </div>
      </div>
      <Footer availableTokens={props.availableTokens} />
    </div>
  );
};

export default Page;
