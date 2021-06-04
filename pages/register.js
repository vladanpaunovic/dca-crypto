import { getSession } from "next-auth/client";
import Head from "next/head";
import { AppContextProvider } from "../components/Context/Context";
import Register from "../components/Register/Register";

export default function RegisterPage(props) {
  return (
    <AppContextProvider availableTokens={props.availableTokens}>
      <Head>
        <title>DCA Crypto - Register</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content={`Register and start dollar cost averaging your favorite cryptocurrencies in less then 4 minutes.`}
        />
      </Head>
      <Register referralCode={props.referralCode} />
    </AppContextProvider>
  );
}

// This is the recommended way for Next.js 9.3 or newer
export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (session) {
    context.res.statusCode = 302;
    context.res.setHeader("Location", `/dashboard`);
  }

  return {
    props: {
      referralCode: context.query.ref || null,
    },
  };
}
