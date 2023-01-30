import { Card, Flex, Metric, Text } from "@tremor/react";

import Currency from "../Currency/Currency";

const CardTotalInvestment = ({ text, totalInvestment }) => {
  return (
    <div data-testid="total-investment" className="flex">
      <Card>
        <Text>Total Investment</Text>

        <Metric>
          <Currency value={totalInvestment} />
        </Metric>

        <Flex
          justifyContent="justify-start"
          spaceX="space-x-2"
          marginTop="mt-4"
        >
          <Text>{text}</Text>
        </Flex>
      </Card>
    </div>
  );
};

export default CardTotalInvestment;
