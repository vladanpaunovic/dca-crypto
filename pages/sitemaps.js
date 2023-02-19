import { CACHE_INVALIDATION_INTERVAL } from "../config";
import prismaClient from "../server/prisma/prismadb";

function generateSiteMap(entries) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset 
    xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
     ${entries
       .map(([url, date]) => {
         return `
       <url>
           <loc>${url}</loc>
           <lastmod>${date}</lastmod>
           <changefreq>daily</changefreq>
       </url>
     `;
       })
       .join("")}
   </urlset>
 `;
}

export async function getServerSideProps(context) {
  const bigKeyValueStore = await prismaClient.bigKeyValueStore.findUnique({
    where: {
      key: "sitemaps",
    },
  });

  const sitemaps = generateSiteMap(bigKeyValueStore.value);

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
