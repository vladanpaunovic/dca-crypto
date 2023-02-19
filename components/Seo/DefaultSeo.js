import { DefaultSeo as NextSeoDefault } from "next-seo";
import { WEBSITE_URL } from "../../config";
import generateSEOYear from "../../src/generateSEOYear/generateSEOYear";

export default function DefaultSeo() {
  return (
    <NextSeoDefault
      titleTemplate={`DCA Crypto | ${generateSEOYear()} %s`}
      defaultTitle="DCA Crypto"
      additionalLinkTags={[
        {
          rel: "icon",
          href: "/favicon.svg",
        },
        {
          rel: "mask-icon",
          href: "/mask-icon.svg",
          color: "#000000",
        },
      ]}
      twitter={{
        handle: "@dca_cc",
        site: "@dca_cc",
        cardType: "summary_large_image",
      }}
      openGraph={{
        type: "website",
        title: "DCA Crypto | DCA and Lump Sum Investment Calculator",
        description:
          "Calculate your returns with dollar cost averaging or lump sum investing, the perfect tool for cryptocurrency investors.",
        locale: "en_GB",
        url: `https://${WEBSITE_URL}`,
        site_name: "DCA-CC",
        images: [
          {
            url: `https://${WEBSITE_URL}/images/meta-open-graph-dca.jpg`,
            width: 1200,
            height: 697,
            alt: "Dollar cost averaging (DCA) Calculator",
          },
        ],
      }}
    />
  );
}
