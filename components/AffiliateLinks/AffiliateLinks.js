import ExternalLinkIcon from "../Icons/ExternalLink";
import SupportIcon from "../Icons/SupportIcon";
import Image from "next/image";
import { googleAnalyticsEvent } from "../helpers/GoogleAnalytics";
import { HeartIcon } from "@heroicons/react/outline";

const affiliatePartners = [
  {
    name: "Crypto.com",
    icon: (
      <Image
        src="/images/cryptocom_icon_2.jpeg"
        alt="Crypto.com"
        layout="fill"
      />
    ),
    pitch:
      "Use my referral link 6mn8gxz6tn to sign up for Crypto.com and we both get $25 USD",
    affiliateLink: "https://crypto.com/app/6mn8gxz6tn",
    value: "$25 USD",
  },
  {
    name: "Deltabadger",
    icon: (
      <Image src="/images/deltabadger_icon.jpeg" alt="Ledger" layout="fill" />
    ),
    pitch:
      "Automate dollar-cost averaging with popular exchanges. Five-minute setup.",
    affiliateLink: "https://app.deltabadger.com/en/ref/DCACC",
    value: "10% discount",
  },
];

const donationMeta = {
  name: "Donate",
  icon: <HeartIcon className="text-red-500" />,
  pitch:
    "Make one time donation (in crypto) and help me support and grow this project.",
  affiliateLink:
    "https://commerce.coinbase.com/checkout/d090d647-be30-4621-a494-3b7ee3d6827d",
};

const AffiliatePartner = (props) => {
  const { name, pitch, affiliateLink, icon, value } = props;
  return (
    <div className="bg-white dark:bg-gray-900 p-2 md:px-4 md:py-5 flex md:col-span-3">
      <div className="w-10 h-10">
        <div className="w-10 h-10 relative">{icon}</div>
      </div>
      <div className="pl-2">
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
          {value && (
            <span className="ml-1 rounded-full bg-green-100 dark:bg-green-700 text-green-300 font-medium text-xs px-2 py-1">
              {value}
            </span>
          )}
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
    <div className="p-4 md:p-0 bg-gray-100 md:bg-white dark:bg-gray-800 dark:md:bg-gray-900">
      <div className="col-span-6 md:col-span-3 overflow-hidden border md:border-none rounded-lg dark:border-gray-700 shadow-lg md:shadow-none">
        <div className="p-2 md:p-4 dark:bg-gray-900">
          <h5 className="flex md:text-lg font-medium text-gray-900 dark:text-white">
            <SupportIcon /> Support this site
          </h5>
          <p className="hidden md:block mt-1 max-w-2xl text-xs text-gray-500 dark:text-white">
            Likes below are affiliate links, meaning, at no additional cost to
            you, I will earn a commision if you click trough and make a purchase
          </p>
        </div>
        <div className="grid grid-cols-1 border-t border-gray-200 dark:border-gray-800 divide-y dark:divide-gray-800">
          {[...affiliatePartners, donationMeta].map((partner, index) => (
            <AffiliatePartner
              key={partner.affiliateLink}
              {...partner}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AffiliateLinks;
