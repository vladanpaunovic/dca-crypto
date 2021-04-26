import Link from "next/link";

const Logo = () => {
  return (
    <Link href="/">
      <a className="flex order-first lg:order-none lg:w-1/5 title-font font-medium items-center lg:items-center lg:justify-left mb-4 md:mb-0 ">
        <span className="pl-4 pr-2 py-1 text-lg text-indigo-700 bg-white font-bold border border-r-0 rounded-l dark:bg-gray-900 dark:text-yellow-500 dark:border-gray-900">
          DCA
        </span>
        <span className="pl-2 pr-4 py-1 text-lg text-gray-900 bg-gray-100 font-medium rounded-r border border-l-0 dark:bg-gray-800 dark:text-white dark:border-gray-900">
          Cryptocurrency
        </span>
      </a>
    </Link>
  );
};

export default Logo;
