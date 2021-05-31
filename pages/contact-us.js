import Head from "next/head";
import ContactUs from "../components/ContactUs/ContactUs";
import { AppContextProvider } from "../components/Context/Context";
import Navigation from "../components/Navigarion/Navigation";

export default function ContactUsPage(props) {
  return (
    <AppContextProvider availableTokens={props.availableTokens}>
      <Head>
        <title>DCA Crypto - Contact us</title>
        <link rel="icon" href="/favicon.ico" />
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
    </AppContextProvider>
  );
}
