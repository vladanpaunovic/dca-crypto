import React from "react";
import { createStripeSession } from "../../src/queries";
import { NextSeo } from "next-seo";
import { useMutation } from "react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/solid";
import { classNames } from "../../styles/utils";
import PaymentMethods from "../../components/PaymentMethods/PaymentMethods";
import FAQ from "../../components/FAQ/FAQ";

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function PricingTab(props) {
  const { data, status } = useSession();
  const router = useRouter();

  const mutation = useMutation((payload) => createStripeSession(payload), {
    onSuccess: (response) => {
      router.push(response.url);
    },
  });

  const handleOnSelect = () => {
    mutation.mutate({
      priceId: props.id,
      type: props.type,
      ...(data?.user?.id ? { userId: data.user.id } : {}),
    });
  };

  const isRecurring = !!props.recurring;

  const intervalLabel = isRecurring ? props.recurring.interval : "for 7 days";
  const pricingDescription = isRecurring
    ? "Recurring billing"
    : "One time payment";

  const isFavorable = isRecurring && props.recurring.interval === "month";
  const isAnnual = isRecurring && props.recurring.interval === "year";
  const featureClasses = classNames(
    isFavorable ? "text-white" : "text-gray-900",
    "h-6 w-6 mr-2"
  );
  return (
    <div
      className={classNames(
        isFavorable
          ? "primary-gradient transform md:scale-105 text-white hover:scale-110"
          : "bg-gray-50 text-gray-900 hover:scale-105",
        "shadow-lg rounded-2xl w-full md:w-64 p-4 transform transition-all"
      )}
    >
      <div className="relative">
        <p className="text-xl font-bold mb-4">{props.product.name}</p>
        {isAnnual ? (
          <p className="absolute -bottom-4 left-0 text-xs font-normal text-indigo-600">
            Get <b>two months</b> for free
          </p>
        ) : null}
      </div>
      <p className="text-3xl font-bold">
        {priceFormatter.format(props.unit_amount / 100)}
        <span className="text-sm opacity-60">/ {intervalLabel}</span>
      </p>
      <p className="text-xs mt-4 opacity-60">{pricingDescription}</p>
      <ul className="text-sm w-full mt-6 mb-6">
        <li className="mb-3 flex items-center">
          <CheckCircleIcon className={featureClasses} />
          AI - chat with our data
        </li>

        <li className="mb-3 flex items-center">
          <CheckCircleIcon className={featureClasses} />
          All unlimited features
        </li>

        {isRecurring ? (
          <li className="mb-3 flex items-center">
            <CheckCircleIcon className={featureClasses} /> Continuous access
          </li>
        ) : (
          <li className="mb-3 flex items-center">
            <CheckCircleIcon className={featureClasses} />
            Time limited access
          </li>
        )}
        {isRecurring ? (
          <li className="mb-3 flex items-center">
            <CheckCircleIcon className={featureClasses} />
            Full access
          </li>
        ) : (
          <li className="mb-3 flex items-center opacity-50">
            <XCircleIcon className={featureClasses} />
            Expires in 7 days
          </li>
        )}
      </ul>
      {data?.user?.hasActivePackage ? null : (
        <button
          type="button"
          disabled={status === "loading"}
          onClick={handleOnSelect}
          className="bg-gray-900 rounded-md text-white p-2 w-full hover:opacity-80 transition"
        >
          Choose plan
        </button>
      )}
    </div>
  );
}

function Pricing(props) {
  if (!props.pricing) {
    return null;
  }

  return (
    <div className="w-full">
      <NextSeo
        title="Pricing &amp; Upgrade - DCA-CC"
        description="Select a plan that's right for you"
      />
      <main className="w-full ">
        <div className="px-8 py-16">
          <h1 className="h1-title text-center">
            Select a plan that is right for you
          </h1>
        </div>
        <div className="w-full p-8 gap-8 flex-col md:flex-row bg-white flex justify-center">
          {props.pricing?.map((price) => (
            <PricingTab key={price.id} {...price} />
          ))}
        </div>
        <div className="w-full flex justify-center pt-16 pb-8">
          <PaymentMethods />
        </div>
        <div className="w-full flex justify-center pt-16">
          <FAQ />
        </div>
      </main>
    </div>
  );
}

export default Pricing;
