import BinanceLogo from "./Icons/BinanceLogo";
import CexLogo from "./Icons/CexLogo";
import CoinbaseLogo from "./Icons/CoinbaseLogo";
import FTXLogo from "./Icons/FTXLogo";
import KrakenLogo from "./Icons/KrakenLogo";

const availableExchanges = [
  {
    name: "Binance",
    logo: (
      <BinanceLogo className="w-full h-full fill-current dark:text-gray-500 text-gray-400" />
    ),
  },
  {
    name: "FTX",
    logo: (
      <FTXLogo className="w-full h-full  fill-current dark:text-gray-500 text-gray-400" />
    ),
  },
  {
    name: "Coinbase Pro",
    logo: (
      <CoinbaseLogo className="w-full h-full pb-3 fill-current dark:text-gray-500 text-gray-400" />
    ),
  },
  {
    name: "Kraken",
    logo: (
      <KrakenLogo className="w-full h-full  fill-current dark:text-gray-500 text-gray-400" />
    ),
  },
  {
    name: "Cex",
    logo: (
      <CexLogo className="w-full h-full  fill-current dark:text-gray-500 text-gray-400" />
    ),
  },
];

const AvailableExchanges = () => {
  return (
    <div className="mt-8">
      <div className="container lg:px-6 max-w-7xl mx-auto max-w-80">
        <h3 className="font-semibold text-2xl text-center text-gray-400 dark:text-gray-500 mb-20">
          DCA with worlds most trusted exchanges
        </h3>
        <div className="w-full grid grid-cols-5 gap-8 items-center justify-center px-10  md:px-4">
          {availableExchanges.map((exchange) => (
            <div
              key={exchange.name}
              className="flex justify-center col-span-5 lg:col-span-1"
            >
              <div className="w-40 h-20" title={exchange.name}>
                {exchange.logo}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AvailableExchanges;
