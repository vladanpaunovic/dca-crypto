import Head from "next/head";
import ContactUs from "../components/ContactUs/ContactUs";
import { AppContextProvider } from "../components/Context/Context";
import Footer from "../components/Footer/Footer";
import Navigation from "../components/Navigarion/Navigation";
import { CACHE_INVALIDATION_INTERVAL, defaultCurrency } from "../config";
import { getAllCoins } from "../queries/queries";

export async function getServerSideProps(context) {
  const availableTokens = await getAllCoins(
    context.query.currency || defaultCurrency
  );

  context.res.setHeader(
    "Cache-Control",
    `s-maxage=${CACHE_INVALIDATION_INTERVAL}, stale-while-revalidate`
  );

  return {
    props: {
      availableTokens,
    },
  };
}

export default function ContactUsPage(props) {
  console.log(props);
  return (
    <AppContextProvider availableTokens={props.availableTokens}>
      <Head>
        <title>DCA Crypto - Contact us</title>
        <link rel="icon" href="/favicon.svg" />
        <link rel="mask-icon" href="/mask-icon.svg" color="#000000" />
        <meta
          name="description"
          content="Dollar cost average calculator for top 100 cryptocurrencies. Visualize and examine the impact of your investments in crypto."
        />
      </Head>
      <div className="border-b border-gray-50 dark:border-gray-700">
        <Navigation />
      </div>
      <div className="lg:flex min-h-screen items-center lg:px-36 ">
        <div className="lg:shadow-2xl lg:rounded-xl">
          <ContactUs />
        </div>
      </div>
      <Footer availableTokens={props.availableTokens} />
    </AppContextProvider>
  );
}
