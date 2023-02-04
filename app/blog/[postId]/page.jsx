import NextLink from "next/link";
import NextImage from "next/image";
import Footer from "../../../components/Footer/Footer";

import { getAllCoins } from "../../../queries/queries";
import React from "react";
import ReactMarkdown from "react-markdown";
import dayjs from "dayjs";
import { defaultCurrency } from "../../../config";
import { NextSeo } from "next-seo";
import Navigation from "../../../components/Navigarion/Navigation";
import { getPostById, getSortedPostsData } from "../../../common/posts";
import BreadcrumbBlogPost from "../../../components/Breadcrumb/BreadcrumbBlogPost";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const allPostsData = getSortedPostsData();

  return allPostsData.map((post) => ({ id: post.id, postId: post.id }));
}

export const RelatedPosts = async ({ posts }) => {
  if (!posts) {
    return null;
  }

  return (
    <div className="flex flex-col">
      <h3 className="text-gray-800 dark:text-gray-100 text-xl font-bold mb-4">
        More posts
      </h3>
      <div className="grid grid-cols-3 gap-4">
        {posts.map((post) => (
          <NextLink
            href={`/blog/${post.id}`}
            key={post.id}
            passHref
            className="border shadow hover:shadow-lg"
          >
            <div className="w-full h-36 relative">
              <NextImage
                alt={post.title}
                src={`/blog/${post.id}.jpg`}
                priority
                fill
                sizes="(max-width: 768px) 100vw,(max-width: 1200px) 50vw,33vw"
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

export default async function Page({ params: { postId } }) {
  const content = getPostById(postId);

  const otherPosts = getSortedPostsData()
    .filter((post) => post.id !== content.id)
    .splice(0, 10);

  if (!content) {
    return notFound();
  }

  return (
    <>
      <NextSeo
        useAppDir
        title={content.title}
        description={
          content.description ||
          `Dollar cost average calculator for top 100 cryptocurrencies - ${content.title}.`
        }
      />
      <Navigation />
      <div className="w-full h-96 relative mb-4">
        <NextImage
          alt={content.title}
          src={`/blog/${content.id}.jpg`}
          priority
          fill
          sizes="(max-width: 768px) 100vw,(max-width: 1200px) 50vw,33vw"
          style={{
            objectFit: "cover",
            padding: "0",
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
          <div className="max-w-3xl prose dark:prose-dark">
            <h1 className="text-center text-gray-800 dark:text-gray-100 leading-10 font-extrabold text-4xl mb-10 pb-8">
              {content.title}
            </h1>
            <p className="text-xs text-gray-500">
              Updated at {dayjs(content.date).format("YYYY-MM-DD")}
            </p>
            <ReactMarkdown>{content.content}</ReactMarkdown>
          </div>
        </div>
        <div className="flex justify-center mt-12">
          <div className="max-w-3xl">
            <RelatedPosts posts={otherPosts} />
          </div>
        </div>
      </article>
      <div className="flex justify-center">
        <div className="max-w-7xl px-8 w-full">
          <hr />
        </div>
      </div>
      <Footer />
    </>
  );
}
