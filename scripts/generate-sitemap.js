const fs = require("fs");
const path = require("path");
const axios = require("axios");
const prettier = require("prettier");
const getDate = new Date().toISOString();

const WEBSITE_DOMAIN = "https://www.dca-cc.com";

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
      ${dcaListSitemap}
    </urlset>
  `;

  const formattedSitemap = formatted(generatedSitemap);

  const pathName = path.join(__dirname, "../", "public", "sitemap.xml");
  fs.writeFileSync(pathName, formattedSitemap, "utf8");

  console.log("[SITEMAPS] Sitemaps generated.");
};

generateSitemaps();
