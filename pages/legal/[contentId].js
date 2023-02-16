import NextError from "next/error";
import Footer from "../../components/Footer/Footer";

import React from "react";
import ReactMarkdown from "react-markdown";
import dayjs from "dayjs";
import { NextSeo } from "next-seo";
import Navigation from "../../components/Navigarion/Navigation";
import prismaClient from "../../server/prisma/prismadb";

const availablePages = ["cookie-policy", "privacy-policy", "terms-conditions"];

export async function getStaticPaths() {
  const paths = availablePages.map((post) => ({
    params: { id: post, contentId: post },
  }));

  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const bigKeyValueStore = await prismaClient.bigKeyValueStore.findUnique({
    where: {
      key: "availableTokens",
    },
  });

  const contentId = params.contentId || null;

  const content = require(`../../content/legal/${contentId}.md`);

  return {
    props: {
      contentId,
      availableTokens: bigKeyValueStore.value,
      content,
    },
  };
}

export default function Page({ contentId, availableTokens, content }) {
  if (!availablePages.includes(contentId)) {
    return <NextError statusCode={404} />;
  }

  return (
    <>
      <NextSeo
        title={content.attributes.title}
        description={`Dollar cost average calculator for top 100 cryptocurrencies - ${content.attributes.title}.`}
      />
      <Navigation />
      <article className="p-8">
        <h1 className="text-center text-gray-800 leading-10 font-extrabold text-4xl mb-10">
          {content.attributes.title}
        </h1>
        <div className="flex justify-center">
          <div className="max-w-3xl prose">
            <p>
              Updated at {dayjs(content.attributes.date).format("YYYY-MM-DD")}
            </p>
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
