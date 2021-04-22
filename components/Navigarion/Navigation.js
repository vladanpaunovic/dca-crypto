import { useAppContext } from "../Context/Context";
import { ACTIONS } from "../Context/mainReducer";
import MoonSolid from "../Icons/MoonSolid";
import Link from "next/link";

const Navigation = () => {
  const { dispatch } = useAppContext();

  return (
    <header className="text-indigo-700 body-font shadow w-full bg-white dark:bg-gray-900">
      <div className="mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <Link href="/">
          <a className="flex order-first lg:order-none lg:w-1/5 title-font font-medium items-center lg:items-center lg:justify-left mb-4 md:mb-0">
            <span className="ml-3 text-lg dark:text-white">DCA Crypto</span>
          </a>
        </Link>
        <nav className="flex lg:w-2/5 flex-wrap items-center text-base md:ml-auto"></nav>

        <div className="lg:w-2/5 inline-flex lg:justify-end ml-5 lg:ml-0">
          <button
            className="transition dark:text-white text-gray hover:text-gray-900 rounded-full p-1"
            onClick={() =>
              dispatch({
                type: ACTIONS.TOGGLE_DARK_MODE,
              })
            }
          >
            <MoonSolid />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navigation;
