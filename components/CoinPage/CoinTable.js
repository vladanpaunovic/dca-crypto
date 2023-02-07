import { formatCurrency } from "@coingecko/cryptoformat";
import {
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableBody,
  BadgeDelta,
} from "@tremor/react";
import { useStore } from "../../src/store/store";
import Currency from "../Currency/Currency";

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
  const state = useStore();

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
    <TableRow key={item.date}>
      <TableCell>{item.date}</TableCell>
      <TableCell textAlignment="text-right">
        <Currency value={item["Price"]} />
      </TableCell>
      <TableCell textAlignment="text-right">
        <Currency value={item["Average cost"]} />
      </TableCell>
      <TableCell textAlignment="text-right">
        <Currency value={item["Total investment"]} />
      </TableCell>
      <TableCell textAlignment="text-right">
        <Currency value={item["Balance in FIAT"]} />
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

export default function CoinTable() {
  const state = useStore();

  return (
    <>
      <p className="pl-6 text-gray-500 text-sm">
        Detail view of all your purchases over the time
      </p>
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
              <Currency value={state.chart.input.investment} />
            </TableHeaderCell>
            <TableHeaderCell textAlignment="text-right">
              Profit/Loss %
            </TableHeaderCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {state.chart.dca.chartData.map((item) => (
            <TableItem key={item.date} item={item} />
          ))}
        </TableBody>
      </Table>
    </>
  );
}
