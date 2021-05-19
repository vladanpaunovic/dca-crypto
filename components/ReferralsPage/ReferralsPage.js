import useCopyToClipboard from "../../hooks/useCopyToClipboard";
import {
  useMyReferrals,
  useMySubscription,
  useUpdateUser,
} from "../../queries/queries";
import DashboardTitle from "../Dashboard/DashboardTitle";
import DashboardMenu from "../Dashboard/Menu/DashboardMenu";
import { WEBSITE_URL } from "../../config";
import {
  CreditCardIcon,
  CurrencyDollarIcon,
  HeartIcon,
  PresentationChartBarIcon,
  PresentationChartLineIcon,
  ShareIcon,
} from "@heroicons/react/outline";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { useState } from "react";
import Loading from "../Loading/Loading";
import { useSession } from "next-auth/client";
import Link from "next/link";
dayjs.extend(localizedFormat);

const ReferralLink = (props) => {
  const referralLink = `${WEBSITE_URL}/register?ref=${props.referralCode}`;
  const [copyReferralLinkStatus, copyReferralLink] = useCopyToClipboard(
    referralLink
  );

  let buttonText = "Copy";
  if (copyReferralLinkStatus === "copied") {
    buttonText = "Copied";
  } else if (copyReferralLinkStatus === "failed") {
    buttonText = "Copy failed!";
  }

  return (
    <div>
      <span className="mr-2 font-medium">
        Share your link or share on social media:
      </span>
      <div className="mt-2 mr-2 flex flex-col justify-between">
        <div className="flex flex-col lg:flex-row w-full mb-8">
          <div className="text-base select-all focus:outline-none border border-gray-900 dark:border-gray-300 border-dashed p-2 w-full text-center font-medium text-gray-600 dark:text-gray-200 rounded-md dark:bg-gray-700">
            {referralLink}
          </div>
          <button
            onClick={copyReferralLink}
            className="mb-4 lg:mb-0 lg:ml-4 py-2 lg:px-3 rounded-lg font-medium border-2 border-indigo-500 dark:border-yellow-500 text-indigo-500 dark:text-yellow-500"
          >
            {buttonText}
          </button>
        </div>
        <div className="flex">
          <a
            target="_blank"
            rel="canonical"
            data-size="large"
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
              "Join me on DCA-CC and get 3 months of dollar cost averaging for free!"
            )}&url=${encodeURIComponent(
              referralLink
            )}&hashtags=DCA,CRYPTO,BTC,ETH`}
            className="flex items-center justify-between transition rounded bg-blue-400 hover:bg-blue-500 dark:bg-gray-900 dark:hover:bg-gray-800 py-1 px-2 text-white dark:text-yellow-500 font-medium border shadow border-transparent"
          >
            Share on Twitter
            <span>
              <ShareIcon className="ml-1 h-4 w-4" />
            </span>
          </a>
          <a
            target="_blank"
            rel="canonical"
            data-size="large"
            href={`https://t.me/share/url?url=${encodeURIComponent(
              referralLink
            )}&text=${encodeURIComponent(
              "Join me on DCA-CC and get 3 months of dollar cost averaging for free!"
            )}`}
            className="ml-2 flex items-center justify-between transition rounded bg-blue-400 hover:bg-blue-500 dark:bg-gray-900 dark:hover:bg-gray-800 py-1 px-2 text-white dark:text-yellow-500 font-medium border shadow border-transparent"
          >
            Share on Telegram
            <span>
              <ShareIcon className="ml-1 h-4 w-4" />
            </span>
          </a>
        </div>
      </div>
    </div>
  );
};

const Friends = (props) => {
  return (
    <div className="w-full">
      <h2 className="font-medium">People signed using your referral link:</h2>
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full overflow-hidden">
          <table className="min-w-full leading-normal mt-2 divide-y dark:divide-gray-700">
            <thead>
              <tr>
                <th
                  scope="col"
                  className="pr-5 py-3 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 text-left text-sm uppercase font-semibold"
                >
                  Person
                </th>
                <th
                  scope="col"
                  className="px-5 py-3 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 text-left text-sm uppercase font-semibold"
                >
                  Signed at
                </th>
                <th
                  scope="col"
                  className="px-5 py-3 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 text-left text-sm uppercase font-semibold"
                >
                  Current plan
                </th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-700">
              {props.referrals.map((ref) => (
                <tr key={ref.username}>
                  <td className="pr-5 py-5 bg-white dark:bg-gray-900 text-sm">
                    <div className="flex items-center">
                      <p className="text-gray-900 dark:text-gray-200 whitespace-no-wrap">
                        {ref.username}
                      </p>
                    </div>
                  </td>
                  <td className="px-5 py-5 bg-white dark:bg-gray-900 text-sm">
                    <p className="text-gray-900 dark:text-gray-200 whitespace-no-wrap">
                      {dayjs(ref.subscription.startDate).format("LL")}
                    </p>
                  </td>
                  <td className="px-5 py-5 bg-white dark:bg-gray-900 text-sm">
                    <span
                      className={`inline-flex items-center justify-center rounded-full px-2 py-1 font-semibold leading-tight ${
                        ref.subscription.plan.isFree
                          ? "bg-gray-400 dark:bg-gray-600 text-gray-100"
                          : "bg-green-400 text-green-900"
                      }`}
                    >
                      {ref.subscription.plan.name}
                    </span>
                  </td>
                </tr>
              ))}
              {!props.referrals.length && (
                <tr>
                  <td
                    colSpan={3}
                    className="pr-5 py-5 bg-white dark:bg-gray-900 text-sm"
                  >
                    <div className="flex items-center">
                      <p className="text-gray-900 dark:text-gray-200 whitespace-no-wrap">
                        You don't have any referrals at the moment. Share your
                        referral link to earn $25 per user.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const Earnings = (props) => {
  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="shadow-lg rounded-2xl p-4 bg-white dark:bg-gray-900">
        <div className="flex items-center">
          <span className="rounded-full relative p-0 bg-indigo-200 dark:bg-yellow-900">
            <CurrencyDollarIcon className="text-indigo-500 dark:text-yellow-500 h-8 w-8" />
          </span>
          <p className="text-md text-black font-medium dark:text-white ml-2">
            Available for withdrawal
          </p>
        </div>
        <div className="flex flex-col justify-start">
          <p className="text-gray-700 dark:text-gray-100 text-4xl text-left font-bold my-4">
            {props.currentlyAvailable}
            <span className="text-sm">$</span>
          </p>
        </div>
      </div>

      <div className="shadow-lg rounded-2xl p-4 bg-white dark:bg-gray-900">
        <div className="flex items-center">
          <span className="rounded-full relative p-0 bg-indigo-200 dark:bg-yellow-900">
            <CurrencyDollarIcon className="text-indigo-500 dark:text-yellow-500 h-8 w-8" />
          </span>
          <p className="text-md text-black font-medium dark:text-white ml-2">
            Total earned
          </p>
        </div>
        <div className="flex flex-col justify-start">
          <p className="text-gray-700 dark:text-gray-100 text-4xl text-left font-bold my-4">
            {props.totalEarned}
            <span className="text-sm">$</span>
          </p>
        </div>
      </div>
    </div>
  );
};

const AddressForm = (props) => {
  const [btcAddress, setBtcAddress] = useState(props.payoutBTCAddress || "");
  const updateUser = useUpdateUser();

  const handleOnSubmit = (e) => {
    e.preventDefault();

    updateUser.mutate({ payoutBTCAddress: btcAddress });
  };

  const ctaText = btcAddress.length ? "Update" : "Save";

  return (
    <div className="rounded-2xl shadow-2xl bg-white dark:bg-gray-900 p-8 mt-8">
      <label
        htmlFor="btc-address"
        className="text-gray-700 dark:text-gray-100 font-medium"
      >
        Payout address
        <p className="font-normal text-gray-500 text-sm mt-2">
          Your <span className="font-semibold">Bitcoin BTC</span> wallet address
        </p>
      </label>
      <form onSubmit={handleOnSubmit} className="flex mt-2">
        <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
          <CreditCardIcon className="text-gray-400 w-5 h-5" />
        </div>
        <input
          id="btc-address"
          type="text"
          spellCheck={false}
          value={btcAddress}
          onChange={(e) => setBtcAddress(e.target.value)}
          placeholder="Make sure to put your Bitcoin (BTC) address here"
          className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-800 dark:text-gray-100 "
        />
        <button
          type="submit"
          className="focus:outline-none ml-4 select-all rounded-lg font-medium border-2 border-indigo-500 dark:border-yellow-500 text-indigo-500 dark:text-yellow-500 px-3"
        >
          {updateUser.isLoading ? (
            <Loading withWrapper width={20} height={20} />
          ) : (
            ctaText
          )}
        </button>
      </form>
    </div>
  );
};

const ReferralsPage = () => {
  const myReferrals = useMyReferrals();
  const mySubscription = useMySubscription();

  let content;

  if (!mySubscription.data || mySubscription.isLoading) {
    return <Loading withWrapper width={30} height={30} />;
  }

  if (mySubscription.data && mySubscription.data.plan.isFree) {
    content = (
      <>
        <div className="grid lg:grid-cols-2 gap-8 w-full">
          <div>
            <div className="p-16 bg-white dark:bg-gray-700 rounded-2xl shadow-xl text-center font-semibold">
              <p className="pb-4">
                Referral links are available only for users on paid plans.
              </p>
              <p>
                You are currently on a {mySubscription.data.plan.name} plan. See{" "}
                <Link href="/pricing">
                  <a className="underline">our pricing</a>
                </Link>{" "}
                to upgrade.
              </p>
            </div>
            <div className="p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-xl mt-8">
              {myReferrals.data && <Friends {...myReferrals.data} />}
            </div>
          </div>
          <div>
            {myReferrals.data && <Earnings {...myReferrals.data} />}
            {myReferrals.data && <AddressForm {...myReferrals.data} />}
          </div>
        </div>
      </>
    );
  } else {
    content = (
      <>
        <div className="grid lg:grid-cols-2 gap-8 w-full">
          <div>
            <div className="p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-xl">
              {myReferrals.data && <ReferralLink {...myReferrals.data} />}
            </div>
            <div className="p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-xl mt-8">
              {myReferrals.data && <Friends {...myReferrals.data} />}
            </div>
          </div>
          <div>
            {myReferrals.data && <Earnings {...myReferrals.data} />}
            {myReferrals.data && <AddressForm {...myReferrals.data} />}
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="lg:flex">
      <div className="w-12/12 lg:w-16 bg-gray-900 dark:bg-gray-900 border-r border-gray-800">
        <DashboardMenu />
      </div>
      <div className="w-12/12 flex-1 bg-gray-100 dark:bg-gray-800 h-screen z-0">
        <div className="primary-gradient text-white dark:text-gray-900 text-center pb-16 relative">
          <h2 className=" pt-16 text-5xl font-bold">Share your love for DCA</h2>
          <p className="pt-6 text-xl font-semibold">
            Share referal link with friends
          </p>
          <p className="pb-16 text-xl">
            When your friend starts their paid subscription, you get{" "}
            <span className="font-semibold">$25 USD</span>, paid in{" "}
            <span className="font-semibold">BTC</span>
          </p>
        </div>
        <div className="relative p-8 flex -mt-24 z-10">{content}</div>
      </div>
    </div>
  );
};

export default ReferralsPage;
