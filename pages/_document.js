import Document, { Html, Head, Main, NextScript } from "next/document";
import store from "store";
import { GA_TRACKING_ID } from "../config";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    const themeBackground =
      store.get("theme") === "dark" ? "bg-white" : "bg-gray-900";
    return (
      <Html lang="en">
        <Head>
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}}`}
          />
          <script
            async
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
            
              gtag('config', '${GA_TRACKING_ID}');`,
            }}
          />
        </Head>
        <body className={themeBackground}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
