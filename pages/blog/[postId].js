import NextLink from "next/link";
import NextImage from "next/image";
import NextError from "next/error";
import Footer from "../../components/Footer/Footer";

import React from "react";
import ReactMarkdown from "react-markdown";
import dayjs from "dayjs";
import { NextSeo } from "next-seo";
import Navigation from "../../components/Navigarion/Navigation";
import { getPostById, getSortedPostsData } from "../../src/posts";
import BreadcrumbBlogPost from "../../components/Breadcrumb/BreadcrumbBlogPost";
import prismaClient from "../../server/prisma/prismadb";

export async function getStaticPaths() {
  const allPostsData = getSortedPostsData();

  const paths = allPostsData.map((post) => ({
    params: { id: post.id, postId: post.id },
  }));

  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const bigKeyValueStore = await prismaClient.bigKeyValueStore.findUnique({
    where: { key: "availableTokens" },
  });

  const content = getPostById(params.postId);

  if (!content) {
    return {
      notFound: true,
    };
  }

  const otherPosts = getSortedPostsData()
    .filter((post) => post.id !== content.id)
    .splice(0, 10);

  return {
    props: {
      availableTokens: bigKeyValueStore.value,
      content,
      posts: otherPosts,
    },
  };
}

export const RelatedPosts = ({ posts }) => {
  if (!posts) {
    return null;
  }

  return (
    <div className="flex flex-col">
      <h3 className="text-gray-800 text-xl font-bold mb-4">More posts</h3>
      <div className="grid grid-cols-3 gap-4">
        {posts.map((post) => (
          <NextLink
            href={`/blog/${post.id}`}
            key={post.id}
            className="border shadow hover:shadow-lg"
          >
            <div className="w-full h-36 relative">
              <NextImage
                src={`/blog/${post.id}.jpg`}
                priority
                fill
                sizes="100vw"
                style={{
                  objectFit: "cover",
                }}
              />
            </div>
            <div className="prose text-xs p-4">
              <h2>{post.title}</h2>
              <p className="text-xs text-gray-500">
                {dayjs(post.date).format("YYYY-MM-DD")}
              </p>
            </div>
          </NextLink>
        ))}
      </div>
    </div>
  );
};

export default function Page({ availableTokens, content, posts }) {
  if (!content) {
    return <NextError statusCode={404} />;
  }

  return (
    <>
      <NextSeo
        title={content.title}
        description={
          content.description ||
          `Dollar cost average calculator for top 100 cryptocurrencies - ${content.title}.`
        }
      />
      <Navigation />
      <div className="w-full h-96 relative mb-4">
        <NextImage
          src={`/blog/${content.id}.jpg`}
          priority
          fill
          sizes="100vw"
          style={{
            objectFit: "cover",
          }}
        />
      </div>
      <div className="px-4">
        <div className="max-w-3xl">
          <BreadcrumbBlogPost postId={content.id} title={content.title} />
        </div>
      </div>
      <article className="p-8">
        <div className="flex justify-center">
          <div className="max-w-3xl prose">
            <h1 className="text-center text-gray-800 leading-10 font-extrabold text-4xl mb-10 pb-8">
              {content.title}
            </h1>
            <p className="text-xs text-gray-500">
              Updated at {dayjs(content.date).format("YYYY-MM-DD")}
            </p>
            <ReactMarkdown>{content.content}</ReactMarkdown>
            <div>
              <RelatedPosts posts={posts} />
            </div>
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
