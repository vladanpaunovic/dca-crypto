import { useEffect, useState } from "react";
import Image from "next/image";
import { useCurrentCoin } from "../Context/mainReducer";

const DonationAsset = ({ coinId, walletAddress, qrCode }) => {
  const [isClicked, setIsClicked] = useState(false);

  const currentCoin = useCurrentCoin(coinId);

  useEffect(() => {
    setTimeout(() => {
      if (isClicked) {
        setIsClicked(false);
      }
    }, 1000);
  }, [isClicked]);

  const handleOnClick = () => {
    setIsClicked(true);

    navigator.clipboard.writeText(walletAddress);
  };
  return (
    <div className="w-full relative rounded-lg shadow-lg items-start p-4 flex focus:outline-none">
      <div className="flex items-center justify-center">
        <Image src={qrCode} alt={currentCoin.symbol} width="120" height="120" />
      </div>
      <div className="text-left w-full relative">
        <div className="ml-2 flex flex-col">
          <div className="text-gray-900 font-medium dark:text-gray-200 flex items-center">
            <img src={currentCoin.image} className="inline mr-1 w-5 h-5" />
            <div>
              {currentCoin.name}{" "}
              <span className="uppercase text-indigo-500">
                {currentCoin.symbol}
              </span>
            </div>
          </div>
          <span className="text-gray-500 text-sm break-all pl-0 p-2 dark:text-gray-300 select-all">
            {walletAddress}
          </span>
          <button
            onClick={handleOnClick}
            className={`transition hover:bg-indigo-500 hover:text-gray-200 flex items-center font-medium dark:text-gray-200 text-sm border py-1 px-2 rounded ${
              isClicked ? "bg-indigo-500  text-gray-200" : ""
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <span className="ml-2">
              {isClicked ? "Copied!" : "Copy wallet address"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DonationAsset;
