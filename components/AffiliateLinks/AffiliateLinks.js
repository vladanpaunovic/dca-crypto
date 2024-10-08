import ExternalLinkIcon from "../Icons/ExternalLink";
import SupportIcon from "../Icons/SupportIcon";
import Image from "next/image";
import { usePlausible } from "next-plausible";
import { useAppState } from "../../src/store/store";
import { usePostHog } from "posthog-js/react";

const affiliatePartners = [
  {
    name: "Deltabadger",
    icon: (
      <Image
        src="/images/deltabadger_icon.jpeg"
        alt="Ledger"
        width={40}
        height={40}
      />
    ),
    pitch:
      "Automate dollar-cost averaging with popular exchanges. Five-minute setup.",
    affiliateLink: "https://app.deltabadger.com/en/ref/DCACC",
    value: "10% discount",
  },
  // {
  //   name: "Crypto.com",
  //   icon: (
  //     <Image
  //       src="/images/cryptocom_icon_2.jpeg"
  //       alt="Crypto.com"
  //       width={40}
  //       height={40}
  //     />
  //   ),
  //   pitch:
  //     "Use my referral link 6mn8gxz6tn to sign up for Crypto.com and we both get $25 USD",
  //   affiliateLink: "https://crypto.com/app/6mn8gxz6tn",
  //   value: "$25 USD",
  // },
];

const AffiliatePartner = (props) => {
  const state = useAppState();
  const plausible = usePlausible();
  const posthog = usePostHog();

  const { name, pitch, affiliateLink, icon, value } = props;
  return (
    <div className="bg-white p-2 md:px-4 flex md:col-span-3">
      <div className="w-10 h-10">
        <div className="w-10 h-10 relative">{icon}</div>
      </div>
      <div className="pl-2">
        <a
          href={affiliateLink}
          target="_blank"
          rel="nofollow noreferrer"
          className="flex items-center text-gray-900 hover:underline"
          onClick={() => {
            plausible("support_site", {
              props: { affiliate: name, token: state.currentCoin.name },
            });

            posthog.capture("support_site", {
              affiliate: name,
              token: state.currentCoin.name,
            });
          }}
        >
          {name}{" "}
          {value && (
            <span className="ml-1 rounded-full bg-green-100 text-green-800 font-medium text-xs px-2 py-1">
              {value}
            </span>
          )}
          <span className="ml-1 text-gray-500">
            <ExternalLinkIcon />
          </span>
        </a>

        <p className="mt-1 max-w-2xl text-sm text-gray-400">{pitch}</p>
      </div>
    </div>
  );
};

const AffiliateLinks = () => {
  return (
    <div className="p-4 md:p-0 bg-gray-100 md:bg-white">
      <div className="col-span-6 md:col-span-3 overflow-hidden border md:border-none rounded-lg  shadow-lg md:shadow-none">
        <div className="p-2 md:p-4">
          <h5 className="flex md:text-lg font-medium text-gray-900 ">
            <SupportIcon /> Support this site
          </h5>
          <p className="hidden md:block mt-1 max-w-2xl text-xs text-gray-400">
            Links below are affiliate links, meaning, at no additional cost to
            you, I will earn a commision if you click trough and make a purchase
          </p>
        </div>
        <div className="grid grid-cols-1 border-t border-gray-200 divide-y">
          {affiliatePartners.map((partner, index) => (
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
