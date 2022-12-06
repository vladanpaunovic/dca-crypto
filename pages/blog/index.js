import { getSortedPostsData } from "../../common/posts";
import NextImage from "next/image";
import NextLink from "next/link";
import dayjs from "dayjs";

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}

export default function Blog({ allPostsData }) {
  return (
    <div>
      <ul className=" grid grid-cols-4 gap-4 w-full">
        {allPostsData.map(({ id, date, title }) => (
          <li key={id} className="border">
            <NextLink href={`/blog/${id}`}>
              <a>
                <div className="w-full h-72 relative">
                  <NextImage
                    src={`/blog/${id}.jpg`}
                    layout="fill"
                    priority
                    objectFit="cover"
                  />
                </div>
                <div className="prose text-sm p-4">
                  <h2>{title}</h2>
                  <p className="text-xs text-gray-500">
                    {dayjs(date).format("YYYY-MM-DD")}
                  </p>
                </div>
              </a>
            </NextLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
