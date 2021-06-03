import Content from "../../components/Content/Content";
import { dehydrate } from "react-query/hydration";
import { QueryClient, useQuery } from "react-query";
import cmsClient from "../../server/cmsClient";
import Head from "next/head";
import NextError from "next/error";
import Footer from "../../components/Footer/Footer";
import Navigation from "../../components/Navigarion/Navigation";

const fetchContent = async (contentId) => {
  const response = await cmsClient().get(`/contents/${contentId}`);

  return response.data;
};

const availablePages = ["cookie-policy", "privacy-policy", "terms-conditions"];

export async function getServerSideProps(context) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryFn: async () => await fetchContent(context.query.contentId),
    queryKey: `get-content-${context.query.contentId}`,
  });

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      contentId: context.query.contentId || null,
    },
  };
}

export default function Page({ contentId }) {
  const { data } = useQuery({
    queryFn: async () => await fetchContent(contentId),
    queryKey: `get-content-${contentId}`,
    enabled: availablePages.includes(contentId),
  });

  if (!availablePages.includes(contentId)) {
    return <NextError statusCode={404} />;
  }

  return (
    <>
      <Head>
        <title>DCA Crypto - {data.title}</title>
        <meta
          name="description"
          content={`Dollar cost average calculator for top 100 cryptocurrencies - ${data.title}.`}
        />
      </Head>
      <Navigation />
      <div className="p-8">
        <h1 className="text-center text-gray-800 dark:text-gray-100 leading-10 font-extrabold text-4xl mb-10">
          {data.title}
        </h1>
        <div className="flex justify-center">
          <div className="max-w-3xl">
            <Content content={data} />
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="max-w-7xl px-8 w-full">
          <hr />
        </div>
      </div>
      <Footer />
    </>
  );
}
