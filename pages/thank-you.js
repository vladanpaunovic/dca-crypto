import React from "react";
import { CACHE_INVALIDATION_INTERVAL } from "../config";
import { useRouter } from "next/router";
import { CheckCircleIcon } from "@heroicons/react/solid";
import Link from "next/link";
import dayjs from "dayjs";
import Countdown from "react-countdown";

export async function getServerSideProps(context) {
  context.res.setHeader(
    "Cache-Control",
    `s-maxage=${CACHE_INVALIDATION_INTERVAL}, stale-while-revalidate`
  );

  const isSuccessPayment = context.query?.payment === "success";
  const isNewUser = context.query?.newUser === "true";

  if (!isSuccessPayment) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      isSuccessPayment,
      isNewUser,
    },
  };
}

const renderer = ({ seconds, completed }) => {
  if (completed) {
    return <span className="text-gray-900">Redirecting...</span>;
  } else {
    return (
      <span className="text-gray-900">
        You will be redirected in {seconds} seconds.
      </span>
    );
  }
};

const ThankYou = () => {
  const router = useRouter();

  const handleOnComplete = () => {
    router.push("/dca/bitcoin");
  };

  return (
    <div>
      <div className="flex items-center justify-center mt-16 mb-4">
        <div className="mr-2">
          <CheckCircleIcon width={42} height={42} className="text-green-300" />
        </div>
        <h1 className="h1-title">Payment Successful!</h1>
      </div>
      <p className="text-center mb-8">
        <Countdown
          date={dayjs().add("5", "seconds")}
          daysInHours={true}
          className="font-bold"
          onComplete={handleOnComplete}
          renderer={renderer}
        />
      </p>
      <div className="text-center">
        <Link
          href={`/dca/bitcoin`}
          className="bg-gray-900 font-medium text-white py-2 px-4 rounded-md hover:opacity-70"
        >
          Go to DCA Calculator
        </Link>
      </div>
    </div>
  );
};

const ThankYouNewUser = () => {
  return (
    <div>
      <div className="flex items-center justify-center mt-16 mb-4">
        <div className="mr-2">
          <CheckCircleIcon width={42} height={42} className="text-green-300" />
        </div>
        <h1 className="h1-title">Payment Successful!</h1>
      </div>
      <div className="text-center">
        <p>Welcome to DCA-CC.com.</p>
        <p className="mt-12">
          Check your inbox for an email with a login link to get started.
        </p>
      </div>
    </div>
  );
};

export default function HomeWrapper(props) {
  if (props.isNewUser) {
    return <ThankYouNewUser />;
  }
  return <ThankYou />;
}
