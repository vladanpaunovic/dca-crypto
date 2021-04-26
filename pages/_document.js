import Document, { Html, Head, Main, NextScript } from "next/document";
import store from "store";
import { INSIGHTS_TRACKING_ID } from "../config";

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
          <script async src="https://getinsights.io/js/insights.js"></script>
          <script
            async
            dangerouslySetInnerHTML={{
              __html: `insights.init(${INSIGHTS_TRACKING_ID});
              insights.trackPages();`,
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
