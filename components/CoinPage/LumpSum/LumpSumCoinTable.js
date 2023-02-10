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
import { useAppState } from "../../../src/store/store";
import Currency from "../../Currency/Currency";

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
  const state = useAppState();

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
        <Currency value={item["Buying price"]} />
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

export default function LumpSumCoinTable({ chartData }) {
  const state = useAppState();

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
              Purchase Price ($)
            </TableHeaderCell>
            <TableHeaderCell textAlignment="text-right">
              Investment ($)
            </TableHeaderCell>
            <TableHeaderCell textAlignment="text-right">
              FIAT balance ($)
            </TableHeaderCell>
            <TableHeaderCell textAlignment="text-right">
              {state.currentCoin.symbol.toUpperCase()} holdings
            </TableHeaderCell>
            <TableHeaderCell textAlignment="text-right">
              Profit/Loss %
            </TableHeaderCell>
          </TableRow>
        </TableHead>

        <TableBody>
          <TableItem
            key={chartData.chartData[0].date}
            item={chartData.chartData[0]}
          />
        </TableBody>
      </Table>
    </>
  );
}
