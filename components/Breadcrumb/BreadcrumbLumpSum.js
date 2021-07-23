import Breadcrumb from "./Breadcrumb";
import { HomeIcon } from "@heroicons/react/solid";

const BreadcrumbLumpSum = ({ name, coinId }) => {
  const items = [
    {
      name: "Home",
      item: "/",
      icon: <HomeIcon className="w-4 h-4" />,
    },
    {
      name: "Lump Sum Calculator",
      item: "/lump-sum",
    },
    {
      name,
      item: `/lump-sum/${coinId}`,
      isLast: true,
    },
  ];

  return <Breadcrumb items={items} />;
};

export default BreadcrumbLumpSum;
