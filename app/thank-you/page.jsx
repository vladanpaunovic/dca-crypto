"use client";

import React from "react";
import { notFound, useRouter, useSearchParams } from "next/navigation";
import { CheckCircleIcon } from "@heroicons/react/solid";
import Link from "next/link";
import dayjs from "dayjs";
import Countdown from "react-countdown";

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
          date={dayjs().add("5", "seconds").toDate()}
          daysInHours={true}
          className="font-bold"
          onComplete={handleOnComplete}
          renderer={renderer}
        />
      </p>
      <div className="text-center">
        <Link
          href={`/dca/bitcoin`}
          className="bg-gray-900 font-medium text-white dark:bg-white dark:text-gray-900 py-2 px-4 rounded-md hover:opacity-70"
        >
          Go to DCA Calculator
        </Link>
      </div>
    </div>
  );
};

export default function HomeWrapper() {
  const searchParams = useSearchParams();
  const paymentStatus = searchParams.get("payment");

  const isSuccessPayment = paymentStatus === "success";

  if (!isSuccessPayment) {
    return notFound();
  }

  return <ThankYou />;
}
