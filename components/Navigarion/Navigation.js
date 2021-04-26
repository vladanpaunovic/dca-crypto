import { useAppContext } from "../Context/Context";
import { ACTIONS } from "../Context/mainReducer";
import MoonSolid from "../Icons/MoonSolid";
import Link from "next/link";
import DonationModal from "../DonationModal/DonationModal";
import SunshineIcon from "../Icons/SunshineIcon";
import Logo from "../Logo/Logo";

const Navigation = () => {
  const { state, dispatch } = useAppContext();

  return (
    <header className="text-indigo-700 body-font shadow w-full bg-white dark:bg-gray-900 px-3">
      <div className="mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center ">
        <Logo />
        <nav className="flex lg:w-2/5 flex-wrap items-center text-base md:ml-auto"></nav>

        <div className="lg:w-2/5 inline-flex lg:justify-end ml-5 lg:ml-0 ">
          <button
            className="transition dark:text-white text-gray hover:text-gray-900 rounded-full p-1 mr-2 focus:outline-none"
            onClick={() =>
              dispatch({
                type: ACTIONS.TOGGLE_DARK_MODE,
                payload: !state.settings.darkMode,
              })
            }
          >
            {state.settings.darkMode ? (
              <SunshineIcon className="w-5 h-5" />
            ) : (
              <MoonSolid className="w-5 h-5" />
            )}
          </button>
          <DonationModal />
        </div>
      </div>
    </header>
  );
};

export default Navigation;
