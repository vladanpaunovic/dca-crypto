import Link from "next/link";
import { useEffect, useState } from "react";
import store from "store";
import expirePlugin from "store/plugins/expire";
store.addPlugin(expirePlugin);

const COOKIE_CONSENT_NAME = "cookie_consent_given";
const cookieExpiration = new Date().getTime() + 31556952000;
const CookieBanner = () => {
  const [isShown, setIsShown] = useState(false);

  useEffect(() => {
    const initialConsent = store.get(COOKIE_CONSENT_NAME, false);
    setIsShown(!initialConsent);
  }, []);

  const handleOnAccept = () => {
    setIsShown(false);
    store.set(COOKIE_CONSENT_NAME, true, cookieExpiration);
  };

  return (
    isShown && (
      <>
        <div className="border-t sm:border shadow-xl dark:border-gray-700 bg-white dark:bg-gray-900 fixed bottom-0 left-0 sm:bottom-6 sm:left-6 sm:rounded-lg sm:max-w-md z-20">
          <div className="p-4">
            <div className="flex items-center justify-between flex-wrap">
              <div className="flex items-start">
                <div className="max-w-xl text-xs">
                  <p className="font-semibold mb-2">
                    Why do we use cookies for?
                  </p>
                  <p className="font-light mb-2">
                    We use cookies and similar methods to recognize visitors,
                    remember their preferences and analyze site traffic and
                    performance. To learn more about these methods, view our{" "}
                    <Link href="/legal/cookie-policy">
                      <a target="_blank" className="underline">
                        Cookie Policy
                      </a>
                    </Link>
                    .
                  </p>

                  <p className="font-light">
                    You accept the use of cookies or other identifiers by
                    closing or dismissing this notice, by clicking a link or
                    button or by continuing to browse otherwise.
                  </p>
                </div>
              </div>

              <div className="flex mt-4 w-full justify-start">
                <button
                  onClick={handleOnAccept}
                  className="group flex w-full sm:w-auto items-center justify-center px-4 py-2 border border-indigo-500 dark:border-yellow-500 rounded-md shadow-sm text-sm font-medium text-indigo-600 dark:text-yellow-500 hover:bg-indigo-500 hover:text-white dark:hover:bg-yellow-500 dark:hover:text-gray-900"
                >
                  <span className="hidden sm:flex rounded-lg  fill-current text-indigo-500 group-hover:text-white dark:text-yellow-500 dark:group-hover:text-gray-900 mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 512 512"
                    >
                      <path d="M386 256c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10 10 4.477 10 10zm0 0M286 196c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10 10 4.477 10 10zm0 0M266 406c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10 10 4.477 10 10zm0 0M116 226c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10 10 4.477 10 10zm0 0M146 396c22.055 0 40-17.945 40-40s-17.945-40-40-40-40 17.945-40 40 17.945 40 40 40zm0-60c11.027 0 20 8.973 20 20s-8.973 20-20 20-20-8.973-20-20 8.973-20 20-20zm0 0M236 126c0-22.055-17.945-40-40-40s-40 17.945-40 40 17.945 40 40 40 40-17.945 40-40zm-60 0c0-11.027 8.973-20 20-20s20 8.973 20 20-8.973 20-20 20-20-8.973-20-20zm0 0M306 346c0 22.055 17.945 40 40 40s40-17.945 40-40-17.945-40-40-40-40 17.945-40 40zm60 0c0 11.027-8.973 20-20 20s-20-8.973-20-20 8.973-20 20-20 20 8.973 20 20zm0 0M236 306c16.543 0 30-13.457 30-30s-13.457-30-30-30-30 13.457-30 30 13.457 30 30 30zm0-40c5.516 0 10 4.484 10 10s-4.484 10-10 10-10-4.484-10-10 4.484-10 10-10zm0 0M266 502c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10 10 4.477 10 10zm0 0"></path>
                      <path d="M494.398 210.426C487.906 213.707 477.461 216 469 216c-19.875 0-39.453-11.484-47.613-27.926a10.006 10.006 0 00-11.82-5.137C402.573 185.028 396.675 186 391 186c-35.84 0-65-29.16-65-65 0-5.672.973-11.574 3.063-18.566a9.996 9.996 0 00-5.137-11.82C307.484 82.453 296 62.874 296 43c0-8.46 2.293-18.906 5.574-25.398a9.995 9.995 0 00-7.406-14.395C279.926 1.02 267.801 0 256 0 118.02 0 0 117.8 0 256c0 120.02 89.977 228.125 209.29 251.465 5.42 1.058 10.675-2.477 11.733-7.895 1.059-5.422-2.472-10.675-7.894-11.734C103.027 466.3 20 366.633 20 256 20 128.074 128.074 20 256 20c7.3 0 14.79.437 22.98 1.352C277.094 28.363 276 36.02 276 43c0 24.27 12.797 48.352 31.902 61.348C306.613 110.188 306 115.605 306 121c0 46.867 38.133 85 85 85 5.395 0 10.812-.613 16.652-1.902C420.648 223.203 444.73 236 469 236c6.98 0 14.637-1.094 21.648-2.98.914 8.19 1.352 15.68 1.352 22.98 0 110.633-83.027 210.3-193.129 231.836-5.422 1.059-8.953 6.312-7.894 11.73 1.058 5.422 6.312 8.957 11.734 7.899C422.023 484.125 512 376.02 512 256c0-11.8-1.02-23.926-3.207-38.168-1.027-6.71-8.324-10.477-14.395-7.406zm0 0"></path>
                    </svg>
                  </span>{" "}
                  I accept
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  );
};

export default CookieBanner;
