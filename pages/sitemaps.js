import { CACHE_INVALIDATION_INTERVAL } from "../config";
import prismaClient from "../server/prisma/prismadb";
import path from "path";
import fs from "fs";
import matter from "gray-matter";
import { WEBSITE_PATHNAME } from "../config";

function generateSiteMap(entries) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset 
    xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
     ${entries
       .map(([url, date, frequency]) => {
         return `
       <url>
           <loc>${url}</loc>
           <lastmod>${date}</lastmod>
           ${frequency ? `<changefreq>${frequency}</changefreq>` : ""}
       </url>
     `;
       })
       .join("")}
   </urlset>
 `;
}

const postsDirectory = path.join(process.cwd(), "content", "blog");

function getSortedPostsData() {
  // Get file names under /posts
  const posts = fs.readdirSync(postsDirectory);
  const fileNames = posts.map((fileName) => fileName.replace(/\.md$/, ""));

  const allPostsData = fileNames.map((fileName) => {
    // Read markdown file as string
    const fullPath = path.join(postsDirectory, `${fileName}.md`);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    const contents = matter(fileContents);

    // Combine the data with the id
    return {
      id: fileName,
      ...contents.data,
    };
  });

  // Sort posts by date
  return allPostsData.sort(({ date: a }, { date: b }) => {
    if (a < b) {
      return 1;
    } else if (a > b) {
      return -1;
    } else {
      return 0;
    }
  });
}

const getDate = new Date().toISOString();

export async function getServerSideProps(context) {
  const blogSitemap = getSortedPostsData().map((post) => [
    `${WEBSITE_PATHNAME}/blog/${post.id}`,
    new Date(post.date).toISOString(),
  ]);

  const bigKeyValueStore = await prismaClient.bigKeyValueStore.findUnique({
    where: {
      key: "availableTokens",
    },
  });

  const dcaListSitemap = bigKeyValueStore.value.map((e) => [
    `${WEBSITE_PATHNAME}/dca/${e.coinId}`,
    getDate,
    "daily",
  ]);

  const sitemapData = [...dcaListSitemap, ...blogSitemap];

  const sitemaps = generateSiteMap(sitemapData);

  context.res.setHeader(
    "Cache-Control",
    `s-maxage=${CACHE_INVALIDATION_INTERVAL * 24}, stale-while-revalidate`
  );

  context.res.setHeader("Content-Type", "text/xml");
  context.res.write(sitemaps);
  context.res.end();

  return {
    props: {},
  };
}

export default function Sitemaps() {
  return;
}
