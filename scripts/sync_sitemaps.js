require("dotenv").config();
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const matter = require("gray-matter");
const { Redis } = require("@upstash/redis");

const getDate = new Date().toISOString();

const rawRedis = new Redis({
  url: process.env.UPSTASH_REDIS_URL,
  token: process.env.UPSTASH_REDIS_TOKEN,
});

const WEBSITE_DOMAIN = "https://www.dca-cc.com";

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

const blogSitemap = getSortedPostsData().map((post) => [
  `${WEBSITE_DOMAIN}/blog/${post.id}`,
  new Date(post.date).toISOString(),
]);

const generateSitemaps = async () => {
  console.log("[SITEMAPS] Genereting sitemaps...");

  const coinsList = await axios.get(
    "https://api.coingecko.com/api/v3/coins/list"
  );

  const dcaListSitemap = coinsList.data.map((e) => [
    `${WEBSITE_DOMAIN}/dca/${e.id}`,
    getDate,
  ]);

  return [...dcaListSitemap, ...blogSitemap];
};

async function storeSitemapsToRedis(sitemaps) {
  console.log("[SITEMAPS] Storing sitemaps to Redis...");
  await rawRedis.set("sitemaps", sitemaps);
}

async function main() {
  const sitemaps = await generateSitemaps();

  await storeSitemapsToRedis(sitemaps);
}

main();
