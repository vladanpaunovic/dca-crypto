import Head from "next/head";
import NextError from "next/error";
import Footer from "../../components/Footer/Footer";
import Navigation from "../../components/Navigarion/Navigation";
import { getParsedFileContentBySlug } from "../../server/markdown";
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
  const md = getParsedFileContentBySlug(contentId, "/pages/legal");

  return {
    props: {
      contentId,
      metaData: md.frontMatter,
      content: md.content,
      availableTokens,
    },
  };
}

export default function Page({
  contentId,
  metaData,
  content,
  availableTokens,
}) {
  if (!availablePages.includes(contentId)) {
    return <NextError statusCode={404} />;
  }

  return (
    <>
      <Head>
        <title>DCA Crypto - {metaData.title}</title>
        <meta
          name="description"
          content={`Dollar cost average calculator for top 100 cryptocurrencies - ${metaData.title}.`}
        />
      </Head>
      <Navigation />
      <article className="p-8">
        <h1 className="text-center text-gray-800 dark:text-gray-100 leading-10 font-extrabold text-4xl mb-10">
          {metaData.title}
        </h1>
        <div className="flex justify-center">
          <div className="max-w-3xl prose dark:prose-dark">
            <p>Updated at {dayjs(metaData.date).format("YYYY-MM-DD")}</p>
            <ReactMarkdown>{content}</ReactMarkdown>
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
