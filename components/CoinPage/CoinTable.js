import { formatCurrency } from "@coingecko/cryptoformat";
import {
  Card,
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableBody,
  BadgeDelta,
  Tracking,
  TrackingBlock,
  Title,
  Text,
  Divider,
} from "@tremor/react";
import { useAppContext } from "../Context/Context";
import Currency from "../Currency/Currency";
import getPercentageChange from "../helpers/getPercentageChange";

const getDeltaType = (item) => {
  let deltaType = "unchanged";

  if (item.percentageChange > 0) {
    deltaType = "moderateIncrease";
  }

  if (item.percentageChange < 0) {
    deltaType = "moderateDecrease";
  }

  if (parseFloat(item.percentageChange) === 0) {
    deltaType = "unchanged";
  }

  return deltaType;
};
const TableItem = ({ item }) => {
  const { state } = useAppContext();

  const Badge = () => {
    let deltaType = getDeltaType(item);

    return (
      <BadgeDelta
        deltaType={deltaType}
        text={`${item.percentageChange}%`}
        size="xs"
      />
    );
  };

  return (
    <TableRow key={item.name}>
      <TableCell>{item.date}</TableCell>
      <TableCell textAlignment="text-right">
        <Currency value={item.coinPrice} />
      </TableCell>
      <TableCell textAlignment="text-right">
        <Currency value={item.costAverage} />
      </TableCell>
      <TableCell textAlignment="text-right">
        <Currency value={item.totalFIAT} />
      </TableCell>
      <TableCell textAlignment="text-right">
        <Currency value={item.balanceFIAT} />
      </TableCell>
      <TableCell textAlignment="text-right">
        {formatCurrency(
          parseFloat(item.totalCrypto) || 0,
          state.currentCoin.symbol
        )}
      </TableCell>
      <TableCell textAlignment="text-right">
        <Badge item={item} />
      </TableCell>
    </TableRow>
  );
};

const CoinTracked = () => {
  const { state } = useAppContext();
  const statusStyles = {
    moderateIncrease: "emerald",
    moderateDecrease: "rose",
    unchanged: "amber",
  };

  const profitLoss = state.chart.data.map((item) =>
    item.percentageChange > 0 ? "profit" : "loss"
  );

  const onlyProfit = profitLoss.filter((pl) => pl === "profit");

  const percentageDifference = getPercentageChange(
    profitLoss.length,
    onlyProfit.length
  );

  const inProfit = Math.round(100 - Math.abs(percentageDifference));

  return (
    <>
      <Title>Profit/Loss every {state.input.investmentInterval} days</Title>
      <Text>
        Based on your purchase interval you would make profit {inProfit}% of the
        time
      </Text>
      <Tracking marginTop="mt-6">
        {state.chart.data.map((item) => (
          <TrackingBlock
            key={item.date}
            color={statusStyles[getDeltaType(item)]}
            tooltip={item.percentageChange}
          />
        ))}
      </Tracking>
    </>
  );
};

export default function CoinTable() {
  const { state } = useAppContext();

  return (
    <Card>
      <CoinTracked items={state.chart.data} />

      <Divider />
      <Title marginTop="mt-6">Purchases breakdown</Title>
      <Text>Detail view of all your purchases over the time</Text>
      <Table marginTop="mt-6">
        <TableHead>
          <TableRow>
            <TableHeaderCell> Date </TableHeaderCell>
            <TableHeaderCell textAlignment="text-right">
              Coin price ($)
            </TableHeaderCell>
            <TableHeaderCell textAlignment="text-right">
              Average Price ($)
            </TableHeaderCell>
            <TableHeaderCell textAlignment="text-right">
              Investment ($)
            </TableHeaderCell>
            <TableHeaderCell textAlignment="text-right">
              FIAT balance ($)
            </TableHeaderCell>
            <TableHeaderCell textAlignment="text-right">
              {state.currentCoin.symbol.toUpperCase()} in{" "}
              <Currency value={state.input.investment} />
            </TableHeaderCell>
            <TableHeaderCell textAlignment="text-right">
              Profit/Loss %
            </TableHeaderCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {state.chart.data.map((item) => (
            <TableItem key={item.name} item={item} />
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
