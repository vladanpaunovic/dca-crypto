import NextImage from "next/image";
import Footer from "../../components/Footer/Footer";

import React from "react";
import ReactMarkdown from "react-markdown";
import dayjs from "dayjs";
import { getAllCoins } from "../../queries/queries";
import { defaultCurrency } from "../../config";
import { NextSeo } from "next-seo";
import Navigation from "../../components/Navigarion/Navigation";
import { getPostById, getSortedPostsData } from "../../common/posts";

export async function getStaticPaths() {
  const allPostsData = getSortedPostsData();

  const paths = allPostsData.map((post) => ({
    params: { postId: post.id },
  }));

  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const availableTokens = await getAllCoins(params.currency || defaultCurrency);

  const content = getPostById(params.postId);

  if (!content) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      availableTokens,
      content,
    },
  };
}

export default function Page({ availableTokens, content }) {
  return (
    <>
      <NextSeo
        title={content.title}
        description={`Dollar cost average calculator for top 100 cryptocurrencies - ${content.title}.`}
      />
      <Navigation />
      <div className="w-full h-96 relative mb-4">
        <NextImage
          src={`/blog/${content.id}.jpg`}
          layout="fill"
          priority
          objectFit="cover"
        />
      </div>
      <article className="p-8">
        <h1 className="text-center text-gray-800 dark:text-gray-100 leading-10 font-extrabold text-4xl mb-10">
          {content.title}
        </h1>

        <div className="flex justify-center">
          <div className="max-w-3xl prose dark:prose-dark">
            <p className="text-xs text-gray-500">
              Updated at {dayjs(content.date).format("YYYY-MM-DD")}
            </p>
            <ReactMarkdown>{content.content}</ReactMarkdown>
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
