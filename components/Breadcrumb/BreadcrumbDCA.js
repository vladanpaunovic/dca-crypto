import Breadcrumb from "./Breadcrumb";
import { HomeIcon } from "@heroicons/react/solid";

const BreadcrumbDCA = ({ name, coinId }) => {
  const items = [
    {
      name: "Home",
      item: "/",
      icon: <HomeIcon className="w-4 h-4" />,
    },
    {
      name: "DCA Calculator",
      item: "/dca",
    },
    {
      name,
      item: `/dca/${coinId}`,
      isLast: true,
    },
  ];

  return <Breadcrumb items={items} />;
};

export default BreadcrumbDCA;
