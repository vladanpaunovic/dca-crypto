import ExternalLinkIcon from "../Icons/ExternalLink";
import SupportIcon from "../Icons/SupportIcon";
import Image from "next/image";
import { googleAnalyticsEvent } from "../helpers/GoogleAnalytics";
import { HeartIcon } from "@heroicons/react/outline";

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
    <div className="bg-white dark:bg-gray-900 px-4 py-5 flex ">
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
          onClick={() => {
            googleAnalyticsEvent({
              action: "support_site",
              params: { affiliate: name },
            });
          }}
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
    <div className="col-span-6 md:col-span-3 overflow-hidden dark:border-gray-700">
      <div className="p-4 dark:bg-gray-900">
        <h5 className="flex text-lg leading-6 font-medium text-gray-900 dark:text-white">
          <SupportIcon /> Support this site
        </h5>
        <p className="mt-1 max-w-2xl text-xs text-gray-500 dark:text-white">
          Likes below are affiliate links, meaning, at no additional cost to
          you, I will earn a commision if you click trough and make a purchase
        </p>
      </div>
      <div className="border-t border-gray-200 dark:border-gray-800 divide-y dark:divide-gray-800">
        {affiliatePartners.map((partner, index) => (
          <AffiliatePartner
            key={partner.affiliateLink}
            {...partner}
            index={index}
          />
        ))}
        <div className="bg-white dark:bg-gray-900 px-4 py-5 flex ">
          <div>
            <HeartIcon className="w-6 h-6 text-red-500" />
          </div>
          <div className="ml-2">
            <a
              href="https://commerce.coinbase.com/checkout/d090d647-be30-4621-a494-3b7ee3d6827d"
              target="_blank"
              rel="nofollow"
              className="flex items-center dark:text-gray-100 hover:underline"
              onClick={() => {
                googleAnalyticsEvent({
                  action: "support_site",
                  params: { affiliate: "donation", type: "crypto" },
                });
              }}
            >
              Donate
              <span className="ml-1 text-gray-500">
                <ExternalLinkIcon />
              </span>
            </a>

            <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-white">
              Make one time donation (in crypto) and help me support and grow
              this project.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AffiliateLinks;
