import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  Block,
  Card,
} from "@tremor/react";
import CalloutPerformance from "../CalloutPerformance";
import CoinChart from "../CoinChart";
import CoinTable from "../CoinTable";
import CoinTracked from "../CoinTracked";
import TopCards from "../TopCards";

const DcaPage = () => {
  return (
    <>
      <TopCards />

      <Block marginTop="mt-6">
        <CoinChart />
      </Block>

      <Block marginTop="mt-6">
        <CalloutPerformance />
      </Block>

      <div data-testid="profit-loss-interval">
        <Card marginTop="mt-6">
          <CoinTracked />
        </Card>
      </div>

      <Block marginTop="mt-6">
        <Accordion expanded={false} shadow={true} marginTop="mt-0">
          <AccordionHeader>
            <span className="text-gray-900">Purchase history</span>
          </AccordionHeader>
          <CoinTable />
          <AccordionBody></AccordionBody>
        </Accordion>
      </Block>
    </>
  );
};

export default DcaPage;
