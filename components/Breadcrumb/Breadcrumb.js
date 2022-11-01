import { BreadcrumbJsonLd } from "next-seo";
import Link from "next/link";
import { ChevronRightIcon } from "@heroicons/react/outline";

const Breadcrumb = ({ name, icon, item, isLast }) => {
  return (
    <>
      <li className="flex items-center text-xs">
        {isLast ? (
          <span className="no-underline text-indigo text-gray-900 dark:text-gray-100">
            {name}
          </span>
        ) : (
          <Link href={item} prefetch={false}>
            <a
              aria-label={name}
              className="no-underline text-indigo text-indigo-500 dark:text-yellow-500 hover:underline"
            >
              {icon ? icon : name}
            </a>
          </Link>
        )}
      </li>
      {!isLast && (
        <li className="px-1 flex items-center text-indigo-400 dark:text-yellow-400">
          <ChevronRightIcon className="w-3 h-3" />
        </li>
      )}
    </>
  );
};

const BreadcrumbWrapper = ({ items }) => (
  <>
    <BreadcrumbJsonLd
      itemListElements={items.map((v, i) => ({ ...v, position: i + 1 }))}
    />
    <nav>
      <ol className="list-reset py-4 px-4 md:px-0 rounded flex">
        {items.map((breadcrumb) => (
          <Breadcrumb key={breadcrumb.item} {...breadcrumb} />
        ))}
      </ol>
    </nav>
  </>
);

export default BreadcrumbWrapper;
