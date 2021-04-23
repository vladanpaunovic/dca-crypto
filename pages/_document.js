import Document, { Html, Head, Main, NextScript } from "next/document";
import store from "store";

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
        <Head />
        <body className={themeBackground}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
