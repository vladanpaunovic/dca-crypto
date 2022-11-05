import { Popover } from "@headlessui/react";
import { CodeIcon, ShareIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
import React from "react";
import { WEBSITE_PATHNAME } from "../../config";
import queryString from "query-string";
import { useTweetMessage } from "../TweetMessage/TweetMessage";
import * as ga from "../helpers/GoogleAnalytics";
import { useAppContext } from "../Context/Context";

const SharingButtons = ({ currentCoin }) => {
  const router = useRouter();
  const pathname = "dca";
  const coinSymbol = currentCoin.symbol.toUpperCase();

  const queryWithoutCoin = {
    investment: router.query.investment,
    investmentInterval: router.query.investmentInterval,
    dateFrom: router.query.dateFrom,
    dateTo: router.query.dateTo,
    duration: router.query.duration,
    currency: router.query.currency,
  };

  const readyQueryString = queryString.stringify(queryWithoutCoin);
  const locationHref = `${WEBSITE_PATHNAME}/${pathname}/${router.query.coin}?${readyQueryString}`;

  const subject = `DCA Crypto - Dollar cost average ${currentCoin.name} (${coinSymbol}) calculator`;
  const priceChartMessage = useTweetMessage(currentCoin);

  const socialNetworks = [
    {
      label: "Twitter",
      color: "#55acee",
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        priceChartMessage
      )}&url=${encodeURIComponent(locationHref)}&hashtags=${coinSymbol},${
        currentCoin.name
      }`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
          <path d="M23.44 4.83c-.8.37-1.5.38-2.22.02.93-.56.98-.96 1.32-2.02-.88.52-1.86.9-2.9 1.1-.82-.88-2-1.43-3.3-1.43-2.5 0-4.55 2.04-4.55 4.54 0 .36.03.7.1 1.04-3.77-.2-7.12-2-9.36-4.75-.4.67-.6 1.45-.6 2.3 0 1.56.8 2.95 2 3.77-.74-.03-1.44-.23-2.05-.57v.06c0 2.2 1.56 4.03 3.64 4.44-.67.2-1.37.2-2.06.08.58 1.8 2.26 3.12 4.25 3.16C5.78 18.1 3.37 18.74 1 18.46c2 1.3 4.4 2.04 6.97 2.04 8.35 0 12.92-6.92 12.92-12.93 0-.2 0-.4-.02-.6.9-.63 1.96-1.22 2.56-2.14z" />
        </svg>
      ),
    },
    {
      label: "Facebook",
      href: `https://facebook.com/sharer/sharer.php?u=https://www.dca-cc.com/dca/bitcoin?investmentInterval=7&investment=50&dateFrom=2020-05-10&dateTo=2021-05-10&currency=usd`,
      color: "#3b5998",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
          <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z" />
        </svg>
      ),
    },

    {
      label: "Reddit",
      color: "#5f99cf",
      href: `https://reddit.com/submit?url=${locationHref}&title=${subject}`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
          <path d="M24 11.5c0-1.65-1.35-3-3-3-.96 0-1.86.48-2.42 1.24-1.64-1-3.75-1.64-6.07-1.72.08-1.1.4-3.05 1.52-3.7.72-.4 1.73-.24 3 .5C17.2 6.3 18.46 7.5 20 7.5c1.65 0 3-1.35 3-3s-1.35-3-3-3c-1.38 0-2.54.94-2.88 2.22-1.43-.72-2.64-.8-3.6-.25-1.64.94-1.95 3.47-2 4.55-2.33.08-4.45.7-6.1 1.72C4.86 8.98 3.96 8.5 3 8.5c-1.65 0-3 1.35-3 3 0 1.32.84 2.44 2.05 2.84-.03.22-.05.44-.05.66 0 3.86 4.5 7 10 7s10-3.14 10-7c0-.22-.02-.44-.05-.66 1.2-.4 2.05-1.54 2.05-2.84zM2.3 13.37C1.5 13.07 1 12.35 1 11.5c0-1.1.9-2 2-2 .64 0 1.22.32 1.6.82-1.1.85-1.92 1.9-2.3 3.05zm3.7.13c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9.8 4.8c-1.08.63-2.42.96-3.8.96-1.4 0-2.74-.34-3.8-.95-.24-.13-.32-.44-.2-.68.15-.24.46-.32.7-.18 1.83 1.06 4.76 1.06 6.6 0 .23-.13.53-.05.67.2.14.23.06.54-.18.67zm.2-2.8c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm5.7-2.13c-.38-1.16-1.2-2.2-2.3-3.05.38-.5.97-.82 1.6-.82 1.1 0 2 .9 2 2 0 .84-.53 1.57-1.3 1.87z" />
        </svg>
      ),
    },

    {
      label: "Linkedin",
      color: "#0077b5",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${locationHref}`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
          <path d="M6.5 21.5h-5v-13h5v13zM4 6.5C2.5 6.5 1.5 5.3 1.5 4s1-2.4 2.5-2.4c1.6 0 2.5 1 2.6 2.5 0 1.4-1 2.5-2.6 2.5zm11.5 6c-1 0-2 1-2 2v7h-5v-13h5V10s1.6-1.5 4-1.5c3 0 5 2.2 5 6.3v6.7h-5v-7c0-1-1-2-2-2z" />
        </svg>
      ),
    },

    {
      label: "Telegram",
      color: "#54A9EB",
      href: `https://telegram.me/share/url?text=${priceChartMessage}&url=${locationHref}`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
          <path d="M.707 8.475C.275 8.64 0 9.508 0 9.508s.284.867.718 1.03l5.09 1.897 1.986 6.38a1.102 1.102 0 0 0 1.75.527l2.96-2.41a.405.405 0 0 1 .494-.013l5.34 3.87a1.1 1.1 0 0 0 1.046.135 1.1 1.1 0 0 0 .682-.803l3.91-18.795A1.102 1.102 0 0 0 22.5.075L.706 8.475z" />
        </svg>
      ),
    },

    {
      label: "E-Mail",
      color: "#777",
      href: `mailto:?subject=${subject};body=${priceChartMessage} - ${locationHref}`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
          <path d="M22 4H2C.9 4 0 4.9 0 6v12c0 1.1.9 2 2 2h20c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM7.25 14.43l-3.5 2c-.08.05-.17.07-.25.07-.17 0-.34-.1-.43-.25-.14-.24-.06-.55.18-.68l3.5-2c.24-.14.55-.06.68.18.14.24.06.55-.18.68zm4.75.07c-.1 0-.2-.03-.27-.08l-8.5-5.5c-.23-.15-.3-.46-.15-.7.15-.22.46-.3.7-.14L12 13.4l8.23-5.32c.23-.15.54-.08.7.15.14.23.07.54-.16.7l-8.5 5.5c-.08.04-.17.07-.27.07zm8.93 1.75c-.1.16-.26.25-.43.25-.08 0-.17-.02-.25-.07l-3.5-2c-.24-.13-.32-.44-.18-.68s.44-.32.68-.18l3.5 2c.24.13.32.44.18.68z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-2">
      {socialNetworks.map((social) => (
        <a
          className="text-white dark:text-gray-900 rounded"
          key={social.label}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.label}
          style={{ backgroundColor: social.color }}
          onClick={() => {
            ga.event({
              action: "share",
              params: {
                method: social.label,
                calculator: pathname,
                token: currentCoin.name,
              },
            });
          }}
        >
          <div className="flex items-center p-1">
            <div aria-hidden="true" className="inline fill-current mr-1">
              {social.icon}
            </div>
            {social.label}
          </div>
        </a>
      ))}
    </div>
  );
};

const ShareChart = () => {
  const { state } = useAppContext();
  const currentCoin = state.currentCoin;
  const router = useRouter();
  const isDca = router.pathname.includes("dca");
  const pathname = isDca ? "dca" : "lump-sum";
  const coinSymbol = currentCoin.symbol.toUpperCase();

  const readyQueryString = queryString.stringify({
    ...router.query,
    type: pathname,
  });
  const locationHref = `${WEBSITE_PATHNAME}/widget?${readyQueryString}`;

  const embedScript = `<iframe src="${locationHref}" title="DCA Crypto - Dollar cost average ${currentCoin.name} (${coinSymbol})
  calculator" width="800" height="600"></iframe>`;

  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button
            title="Share this board with your friends."
            className=""
          >
            <div
              className="py-1 px-2 flex items-center justify-between transition rounded bg-white hover:bg-indigo-50 dark:bg-gray-900 dark:hover:bg-gray-800 text-indigo-700 dark:text-yellow-500 font-medium border shadow border-transparent"
              onClick={() => {
                if (!open) {
                  ga.event({
                    action: "share_attempt",
                    params: { calculator: pathname, token: currentCoin.name },
                  });
                }
              }}
            >
              Share{" "}
              <span className="ml-1">
                <ShareIcon className="w-5 h-5" />
              </span>
            </div>
          </Popover.Button>

          <Popover.Panel className="fixed md:absolute z-10 w-screen transform -translate-x-2/2 bottom-0 md:bottom-auto right-0 md:right-1/2 md:max-w-sm">
            <div className="p-4 bg-white dark:bg-gray-900 rounded border dark:border-gray-700 shadow md:max-w-sm">
              <h4 className="text-normal font-medium mb-2">Share this chart</h4>
              <div className="mb-2">
                <SharingButtons currentCoin={currentCoin} />
              </div>

              <p className="mb-2 mt-4 text-gray-600 dark:text-gray-300 flex items-center">
                Embedded code <CodeIcon className="w-5 h-5 ml-1" />
              </p>
              <p className="bg-gray-200 dark:bg-gray-800 dark:text-gray-100 p-2 text-normal text-xs mb-4 rounded select-all	">
                {embedScript}
              </p>
            </div>
          </Popover.Panel>
        </>
      )}
    </Popover>
  );
};

export default ShareChart;
