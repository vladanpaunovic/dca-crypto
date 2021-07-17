import Head from "next/head";
import NextError from "next/error";
import Footer from "../../components/Footer/Footer";
import Navigation from "../../components/Navigarion/Navigation";

import React from "react";
import ReactMarkdown from "react-markdown";
import dayjs from "dayjs";
import { getAllCoins } from "../../queries/queries";
import { defaultCurrency } from "../../config";

const availablePages = ["cookie-policy", "privacy-policy", "terms-conditions"];

export async function getServerSideProps(context) {
  const availableTokens = await getAllCoins(
    context.query.currency || defaultCurrency
  );

  const contentId = context.query.contentId || null;

  const content = require(`../../content/legal/${contentId}.md`)

  return {
    props: {
      contentId,
      availableTokens,
      content
    },
  };
}

export default function Page({
  contentId,
  availableTokens,
  content
}) {
  if (!availablePages.includes(contentId)) {
    return <NextError statusCode={404} />;
  }

  return (
    <>
      <Head>
        <title>DCA Crypto - {content.attributes.title}</title>
        <meta
          name="description"
          content={`Dollar cost average calculator for top 100 cryptocurrencies - ${content.attributes.title}.`}
        />
      </Head>
      <Navigation />
      <article className="p-8">
        <h1 className="text-center text-gray-800 dark:text-gray-100 leading-10 font-extrabold text-4xl mb-10">
          {content.attributes.title}
        </h1>
        <div className="flex justify-center">
          <div className="max-w-3xl prose dark:prose-dark">
            <p>Updated at {dayjs(content.attributes.date).format("YYYY-MM-DD")}</p>
            <ReactMarkdown>{content.body}</ReactMarkdown>
          </div>
        </div>
      </article>
      <div className="flex justify-center">
        <div className="max-w-7xl px-8 w-full">
          <hr />
        </div>
      </div>
      <Footer availableTokens={availableTokens} />
    </>
  );
}
