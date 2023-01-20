import { getSortedPostsData } from "../../common/posts";
import NextImage from "next/image";
import NextLink from "next/link";
import dayjs from "dayjs";
import { defaultCurrency } from "../../config";
import Navigation from "../../components/Navigarion/Navigation";
import Footer from "../../components/Footer/Footer";
import BreadcrumbBlogPost from "../../components/Breadcrumb/BreadcrumbBlogPost";
import { fetchCoinGeckoMarkets } from "../../server/coinGeckoClient";

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  const availableTokens = await fetchCoinGeckoMarkets(defaultCurrency);

  return {
    props: {
      allPostsData,
      availableTokens,
    },
  };
}

export default function Blog({ allPostsData, availableTokens }) {
  return (
    <div>
      <Navigation />

      <div className="flex justify-center p-4">
        <div className=" max-w-4xl">
          <h1 className="h1-title pt-4 mb-8">DCA-CC Blog</h1>
          <div className="py-4">
            <BreadcrumbBlogPost />
          </div>
          <p className="text-gray-500 text-sm mb-8">Latest posts:</p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 w-full mb-16">
            {allPostsData.map(({ id, date, title }) => (
              <li key={id} className="border">
                <NextLink href={`/blog/${id}`}>
                  <a className="shadow hover:shadow-lg hover:opacity-80 transition">
                    <div className="w-full h-72 relative">
                      <NextImage
                        src={`/blog/${id}.jpg`}
                        layout="fill"
                        priority
                        objectFit="cover"
                      />
                    </div>
                    <div className="prose text-sm p-4">
                      <p className="text-xs text-gray-500">
                        {dayjs(date).format("YYYY-MM-DD")}
                      </p>
                      <h2 className="mt-4">{title}</h2>
                    </div>
                  </a>
                </NextLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Footer availableTokens={availableTokens} />
    </div>
  );
}
