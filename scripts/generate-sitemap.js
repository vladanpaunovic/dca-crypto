const fs = require("fs");
const path = require("path");
const axios = require("axios");
const prettier = require("prettier");
const matter = require("gray-matter");
const getDate = new Date().toISOString();

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

const blogSitemap = getSortedPostsData()
  .map((post) => {
    return `
      <url>
        <loc>${`${WEBSITE_DOMAIN}/blog/${post.id}`}</loc>
        <lastmod>${new Date(post.date).toISOString()}</lastmod>
      </url>`;
  })
  .join("");

const formatted = (sitemap) => prettier.format(sitemap, { parser: "html" });

const generateSitemaps = async () => {
  console.log("[SITEMAPS] Genereting sitemaps...");

  const coinsList = await axios.get(
    "https://api.coingecko.com/api/v3/coins/list"
  );

  const postList = coinsList.data.map((e) => e.id);

  const dcaListSitemap = postList
    .map((id) => {
      return `
          <url>
            <loc>${`${WEBSITE_DOMAIN}/dca/${id}`}</loc>
            <lastmod>${getDate}</lastmod>
            <changefreq>daily</changefreq>
          </url>`;
    })
    .join("");

  const generatedSitemap = `
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset
      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"
    >
      ${dcaListSitemap}${blogSitemap}
    </urlset>
  `;

  const formattedSitemap = formatted(generatedSitemap);

  const pathName = path.join(__dirname, "../", "public", "sitemap.xml");
  fs.writeFileSync(pathName, formattedSitemap, "utf8");

  console.log("[SITEMAPS] Sitemaps generated.");
};

generateSitemaps();
