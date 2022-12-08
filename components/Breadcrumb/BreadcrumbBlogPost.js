import Breadcrumb from "./Breadcrumb";
import { HomeIcon } from "@heroicons/react/solid";

const BreadcrumbBlogPost = ({ title, postId }) => {
  const items = [
    {
      name: "Home",
      item: "/",
      icon: <HomeIcon className="w-4 h-4" />,
    },
    {
      name: "Blog",
      item: "/blog",
      isLast: true,
    },
  ];

  if (postId && title) {
    delete items[1].isLast;

    items.push({
      name: title,
      item: `/blog/${postId}`,
      isLast: true,
    });
  }

  return <Breadcrumb items={items} />;
};

export default BreadcrumbBlogPost;
