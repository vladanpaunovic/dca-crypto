import { ExclamationIcon } from "@heroicons/react/solid";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import { useQuery } from "react-query";
import dynamic from "next/dynamic";
import Loading from "react-loading";

const DynamicPricing = dynamic(() => import("../Pricing/Pricing"), {
  ssr: false,
  loading: () => (
    <div className="h-96">
      <Loading withWrapper width={20} />
    </div>
  ),
});

const Upgrade = () => {
  const session = useSession();
  const pricing = useQuery("pricing", () =>
    fetch("/api/billing/products").then((res) => res.json())
  );

  return (
    <div>
      <div className="bg-yellow-200 rounded-lg">
        <div className="py-44 md:py-6 px-3 sm:px-6 lg:px-6 ">
          <div className="flex flex-wrap flex-col md:flex-row items-center justify-between">
            <div className="flex md:w-0 flex-1 items-center">
              <span className="flex rounded-lg bg-yellow-400 p-2">
                <ExclamationIcon
                  className="h-6 w-6 text-yellow-900"
                  aria-hidden="true"
                />
              </span>
              <div className="ml-3 font-medium text-gray-900">
                <p className="font-bold">
                  <span className="md:hidden">Limit reached.</span>
                  <span className="hidden md:inline">
                    Experience the Full Power of AI!
                  </span>
                </p>
                <p className="text-gray-900">
                  Supercharge your workflow and unlock advanced features
                  designed to help you achieve more in less time. Upgrade now
                  and explore new possibilities that put you in control of your
                  success!
                </p>
              </div>
            </div>
            <div className="order-3 grid grid-cols-2 gap-4 mt-6 md:mt-0 w-full md:w-auto">
              <div className="col-span-2 md:col-span-1 ml-1">
                <Link
                  href="/pricing"
                  className="flex items-center justify-center rounded-md border border-transparent bg-gray-900 px-4 py-2 font-medium leading-6 text-white shadow-sm hover:opacity-80"
                >
                  Upgrade
                </Link>
              </div>
              {session.status === "unauthenticated" && (
                <div className="col-span-2 md:col-span-1">
                  <button
                    className="flex w-full items-center justify-center rounded-md border border-transparent bg-yellow-400 px-4 py-2 font-medium leading-6 text-yellow-900 shadow-sm hover:opacity-80"
                    onClick={() => signIn()}
                  >
                    Login
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="md:px-24 px-4 my-20">
        <h2 className="text-2xl font-medium leading-6 text-gray-900 mb-8">
          What do you get with our AI?
        </h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 items-start gap-8 flex-wrap">
          <li className="">
            <p className="text-lg font-medium leading-6 text-gray-900">
              Personalized Investment Insights
            </p>
            <p className="text-base leading-6 text-gray-500">
              Get tailored recommendations for both Dollar Cost Averaging (DCA)
              and Lump Sum Investing based on real-time data, helping you make
              more informed decisions.
            </p>
          </li>
          <li className=" mb-2">
            <p className="text-lg font-medium leading-6 text-gray-900">
              Real-Time Cryptocurrency Data
            </p>
            <p className="text-base leading-6 text-gray-500">
              Access the latest cryptocurrency prices and compare the
              performance of different assets in seconds, ensuring you never
              miss an opportunity.
            </p>
          </li>
          <li className=" mb-2">
            <p className="text-lg font-medium leading-6 text-gray-900">
              Dynamic Strategy Adjustments
            </p>
            <p className="text-base leading-6 text-gray-500">
              Adjust your investment parameters—like interval, amount, or time
              frame—on the go and instantly see how changes affect your
              performance.
            </p>
          </li>
          <li className=" mb-2">
            <p className="text-lg font-medium leading-6 text-gray-900">
              In-Depth Backtesting
            </p>
            <p className="text-base leading-6 text-gray-500">
              Analyze how your DCA or Lump Sum strategy would have performed in
              past market conditions, allowing you to fine-tune your future
              investments.
            </p>
          </li>
          <li className=" mb-2">
            <p className="text-lg font-medium leading-6 text-gray-900">
              Easy-to-Use Interface
            </p>
            <p className="text-base leading-6 text-gray-500">
              Interact with a user-friendly AI chat designed to answer your
              questions, walk you through strategy changes, and provide clear,
              actionable insights—all in real time.
            </p>
          </li>
        </ul>
      </div>

      {pricing.isSuccess && (
        <div className="bg-white mt-8 rounded-lg pb-3">
          <DynamicPricing pricing={pricing.data} />
        </div>
      )}
    </div>
  );
};

export default Upgrade;
