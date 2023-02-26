import {
  Card,
  Title,
  BarChart,
  AreaChart,
  Text,
  ColGrid,
  Col,
} from "@tremor/react";

const valueFormatter = (number) =>
  `${Intl.NumberFormat("us").format(number).toString()}%`;

export default function DcaOverviewChart(props) {
  const yearlyValues = {};
  props.tableData.forEach((coin) => {
    coin.years.forEach((year) => {
      yearlyValues[year.year] = {
        ...yearlyValues[year.year],
        year: year.year,
        [year.coin.name]: year.insights.opportunityCost
          ? year.insights.percentageChange
          : null,
      };
    });
  });

  const chartData = Object.keys(yearlyValues)
    .map((year) => yearlyValues[year])
    .reverse();

  const coins = props.tableData.map((coin) => coin.coinLabel);

  return (
    <div>
      <Card>
        <Title>Annual Returns per Cryprocurrency</Title>
        <Text>
          Calculating the return of your investment if you started investing in
          a given year
        </Text>
        <ColGrid numColsSm={1} numColsLg={2} gapX="gap-x-6" gapY="gap-y-6">
          <Col>
            <AreaChart
              marginTop="mt-4"
              data={chartData}
              dataKey="year"
              categories={coins}
              valueFormatter={valueFormatter}
              stack={true}
              height="h-80"
            />
          </Col>
          <Col>
            <BarChart
              marginTop="mt-4"
              data={chartData}
              dataKey="year"
              categories={coins}
              valueFormatter={valueFormatter}
              stack={true}
              relative={true}
              height="h-80"
            />
          </Col>
        </ColGrid>
      </Card>
    </div>
  );
}
