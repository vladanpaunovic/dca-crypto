import { useState, useRef } from "react";
import { HeartIcon } from "@heroicons/react/outline";

function DonationModal() {
  const [isHover, setIsHover] = useState(false);

  return (
    <a
      onMouseOver={() => setIsHover(true)}
      onMouseOut={() => setIsHover(false)}
      href="https://commerce.coinbase.com/checkout/d090d647-be30-4621-a494-3b7ee3d6827d"
      target="_blank"
      className="flex items-center sm:px-4 sm:py-2 sm:bg-gradient-to-r sm:from-indigo-400 sm:to-indigo-800 sm:text-white rounded"
    >
      <span className="hidden sm:block">Donate</span>
      <HeartIcon
        fill={isHover ? "currentColor" : "none"}
        className="h-5 w-5 ml-1"
      />
    </a>
  );
}

export default DonationModal;
