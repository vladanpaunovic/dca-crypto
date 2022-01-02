import { useEffect, useState } from "react";
import { detectAnyAdblocker } from "just-detect-adblock";

const detectAdBlocker = async (setter) => {
  const detected = await detectAnyAdblocker();

  return setter(detected);
};

const AdBlockerBanner = () => {
  const [hasAdBlocker, setHasAdBlocker] = useState(false);

  useEffect(() => {
    detectAdBlocker(setHasAdBlocker);
  }, []);

  return (
    hasAdBlocker && (
      <>
        <div className="fixed inset-0 z-10 bg-gray-500 bg-opacity-75 transition-opacity" />
        <div className="fixed z-20 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen text-center">
            <div className="max-w-md w-full dark:border-gray-700 bg-white dark:bg-gray-900 p-4 shadow-xl sm:rounded">
              <h2 className="h1-title text-xl sm:text-3xl">
                It looks like you&apos;re
              </h2>
              <h2 className="h1-title text-xl sm:text-3xl mb-4">
                using an ad-blocker!
              </h2>
              <p className="mb-6 dark:text-gray-300 text-gray-600">
                Yes, ads can be annoying. But when you whitelist us on your ad
                blocker it allows us to continue to bring you sharp tools and
                data you can use to help you build your financial freedom.
              </p>
              <button
                onClick={() => setHasAdBlocker(false)}
                className="py-1 px-3 transition bg-indigo-500 hover:bg-indigo-700 dark:bg-yellow-500 dark:hover:bg-yellow-300 rounded shadow-xl text-white dark:text-gray-900"
              >
                I&apos;ve whitelisted
              </button>
            </div>
          </div>
        </div>
      </>
    )
  );
};

export default AdBlockerBanner;
