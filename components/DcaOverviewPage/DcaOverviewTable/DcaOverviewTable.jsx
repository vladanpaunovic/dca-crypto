import {
  Card,
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableBody,
  MultiSelectBox,
  MultiSelectBoxItem,
} from "@tremor/react";
import { useState } from "react";
import { ChartBarIcon } from "@heroicons/react/solid";
import Link from "next/link";

export default function DcaOverviewTable(props) {
  const [selectedNames, setSelectedNames] = useState([]);

  const isCryptoSelected = (crypto) =>
    selectedNames.includes(crypto.coinLabel) || selectedNames.length === 0;

  return (
    <Card>
      <MultiSelectBox
        onValueChange={(value) => setSelectedNames(value)}
        placeholder="Select Cryptocurrencies..."
        maxWidth="max-w-xs"
      >
        {props.tableData.map((coin) => (
          <MultiSelectBoxItem
            key={coin.coinId}
            value={coin.coinLabel}
            text={coin.coinLabel}
          />
        ))}
      </MultiSelectBox>

      <Table marginTop="mt-6">
        <TableHead>
          <TableRow>
            <TableHeaderCell>Coin</TableHeaderCell>
            <TableHeaderCell textAlignment="text-center">
              {props.years[0]}
            </TableHeaderCell>
            <TableHeaderCell textAlignment="text-center">
              {props.years[1]}
            </TableHeaderCell>
            <TableHeaderCell textAlignment="text-center">
              {props.years[2]}
            </TableHeaderCell>
            <TableHeaderCell textAlignment="text-center">
              {props.years[3]}
            </TableHeaderCell>
            <TableHeaderCell textAlignment="text-center">
              {props.years[4]}
            </TableHeaderCell>
            <TableHeaderCell textAlignment="text-center">
              {props.years[5]}
            </TableHeaderCell>
            <TableHeaderCell textAlignment="text-center">
              {props.years[6]}
            </TableHeaderCell>
            <TableHeaderCell textAlignment="text-center">
              {props.years[7]}
            </TableHeaderCell>
          </TableRow>
        </TableHead>

        <TableBody>
          <TableRow>
            <TableCell>Top Performing Asset</TableCell>
            {props.bestPerformingAssetPerYear.map((asset, index) => {
              return (
                <TableCell
                  key={`${asset.coinId}-${index}`}
                  textAlignment="text-center"
                >
                  {asset.coinLabel}
                </TableCell>
              );
            })}
          </TableRow>

          {props.tableData
            .filter((item) => isCryptoSelected(item))
            .map((coin) => {
              return (
                <TableRow key={coin.coinId}>
                  <TableCell>{coin.coinLabel}</TableCell>
                  {coin.years.map((year, index) => {
                    return (
                      <TableCellPrepped
                        key={`${year.value}-${index}`}
                        value={year.value}
                        width={year.deltaValue}
                        url={year.url}
                      />
                    );
                  })}
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </Card>
  );
}

const TableCellPrepped = (props) => {
  const barColor = props.value > 0 ? "bg-green-500" : "bg-red-500";
  const bgColor = props.value > 0 ? "bg-green-100" : "bg-red-100";

  const buttonColor = () => {
    let color = props.value > 0 ? "text-green-500" : "text-red-500";
    if (props.width > 80) {
      color = props.value > 0 ? "text-green-100" : "text-red-100";
    }

    return color;
  };

  if (props.value === 0)
    return <TableCell textAlignment="text-right">-</TableCell>;

  return (
    <TableCell textAlignment="text-right">
      <Link href={props.url}>
        <a className="flex items-center justify-between group">
          <div className={`${bgColor} relative w-full rounded`}>
            <div className="h-6 flex justify-between w-full items-center px-1 z-50 relative">
              <span className="pl-1 text-gray-900 text-xs">{props.value}%</span>
              <span className="pl-2">
                <ChartBarIcon
                  className={`h-4 w-4 ${buttonColor()} group-hover:text-gray-900`}
                />
              </span>
            </div>
            <span
              style={{
                width: `${props.width}%`,
              }}
              className={`h-6 ${barColor} absolute inset-0 rounded`}
            />
          </div>
        </a>
      </Link>
    </TableCell>
  );
};
