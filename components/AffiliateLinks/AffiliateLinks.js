import ExternalLinkIcon from "../Icons/ExternalLink";
import SupportIcon from "../Icons/SupportIcon";
import InfoIcon from "../Icons/InfoIcon";
import Image from "next/image";
import { Popover } from "@headlessui/react";

const AffiliatePopover = () => {
  return (
    <Popover className="relative ml-1">
      <Popover.Button>
        <InfoIcon className="w-4 h-4 text-gray-500" />
      </Popover.Button>

      <Popover.Panel className="absolute z-10">
        <div className="w-64 border rounded bg-white dark:bg-gray-900 p-2">
          Support this project while using one of our affiliate partners
        </div>
      </Popover.Panel>
    </Popover>
  );
};

const affiliatePartners = [
  {
    name: "Crypto.com",
    icon: "/images/cryptocom_icon_2.jpeg",
    pitch:
      "Use my referral link 6mn8gxz6tn to sign up for Crypto.com and we both get $25 USD",
    description:
      "Crypto.com is the world's fastest growing crypto app. Trade with confidence on the fastest and most secure crypto exchange",
    affiliateLink: "https://crypto.com/app/6mn8gxz6tn",
  },
  {
    name: "Ledger",
    icon: "/images/ledger_icon.png",
    pitch:
      "Buy a Crypto Starter Pack and start your crypto jurney on the right foot",
    description:
      "Curious about crypto, but unsure where to start? The Crypto Starter Pack is made for you! This pack contains a selection of everything you will need to start off on the right foot. Including a Ledger Nano S, a beginner’s guide in PDF format with ultimate tips and tricks, and a 25$ voucher -mailed 14 days after purchase- for you to buy your favorite crypto!",
    affiliateLink:
      "https://shop.ledger.com/products/crypto-starter-pack?r=e3ffe5f7ac6f",
  },
];

const AffiliatePartner = (props) => {
  const { name, pitch, description, affiliateLink, icon, index } = props;
  return (
    <div className="bg-white dark:bg-gray-900 px-4 py-5 flex">
      <div>
        <Image
          src={icon}
          alt={name}
          className="w-full h-full"
          width="30"
          height="30"
        />
      </div>
      <div className="ml-2">
        <a
          href={affiliateLink}
          target="_blank"
          rel="nofollow"
          className="flex items-center dark:text-gray-100 hover:underline"
        >
          {name}{" "}
          <span className="ml-1 text-gray-500">
            <ExternalLinkIcon />
          </span>
        </a>

        <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-white">
          {pitch}
        </p>
      </div>
    </div>
  );
};

const AffiliateLinks = () => {
  return (
    <div className="col-span-6 md:col-span-3 shadow overflow-hidden rounded border dark:border-gray-800">
      <div className="p-4 dark:bg-gray-900">
        <h5 className="flex text-lg leading-6 font-medium text-gray-900 dark:text-white">
          <SupportIcon /> Sponsored content
        </h5>
      </div>
      <div className="border-t border-gray-200 dark:border-gray-900">
        {affiliatePartners.map((partner, index) => (
          <AffiliatePartner
            key={partner.affiliateLink}
            {...partner}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default AffiliateLinks;
