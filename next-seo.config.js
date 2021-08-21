import { WEBSITE_URL } from "./config";

export const defaultSEO = {
  titleTemplate: "DCA Crypto | %s",
  defaultTitle: "DCA Crypto",
  openGraph: {
    type: "website",
    title: "DCA Crypto | Dollar cost average cryptocurrency",
    description:
      "Dollar cost average calculator for top 100 cryptocurrencies. Visualise and examine the impact of your investments in crypto.",
    locale: "en_GB",
    url: `https://${WEBSITE_URL}`,
    site_name: "DCA-CC",
    images: [
      {
        url: `https://${WEBSITE_URL}/images/meta-open-graph-dca.jpg`,
        width: 1200,
        height: 697,
        alt: "Dollar cost averaging calculator",
      },
    ],
  },
  twitter: {
    handle: "@dca_cc",
    site: "@dca_cc",
    cardType: "summary_large_image",
  },
  additionalLinkTags: [
    {
      rel: "icon",
      href: "/favicon.svg",
    },
    {
      rel: "mask-icon",
      href: "/mask-icon.svg",
      color: "#000000",
    },
  ],
};
