import React from "react";
import { AppContextProvider } from "../components/Context/Context";
import Footer from "../components/Footer/Footer";
import { CACHE_INVALIDATION_INTERVAL, defaultCurrency } from "../config";
import {
  createStripeCustomerPortal,
  createStripeSession,
  getAllCoins,
  getAllPricingProducts,
} from "../queries/queries";
import { NextSeo } from "next-seo";
import { useMutation } from "react-query";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Loading from "../components/Loading/Loading";

export async function getServerSideProps(context) {
  const availableTokens = await getAllCoins(
    context.query.currency || defaultCurrency
  );

  const pricing = await getAllPricingProducts();

  context.res.setHeader(
    "Cache-Control",
    `s-maxage=${CACHE_INVALIDATION_INTERVAL}, stale-while-revalidate`
  );

  return {
    props: {
      availableTokens,
      calcType: context.query.type || "dca",
      pricing,
    },
  };
}

export default function HomeWrapper(props) {
  return (
    <AppContextProvider availableTokens={props.availableTokens}>
      <Pricing {...props} />
    </AppContextProvider>
  );
}

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function PricingTab(props) {
  const { data, status } = useSession();
  const router = useRouter();

  const mutation = useMutation((payload) => createStripeSession(payload), {
    onSuccess: (response) => {
      if (data) {
        router.push(response.url);
      } else {
        signIn(undefined, { callbackUrl: response.url });
      }
    },
  });

  const handleOnSelect = () => {
    mutation.mutate({
      priceId: props.id,
      type: props.type,
      ...(data
        ? { customerId: data.user.stripeCustomerId, userId: data.user.id }
        : {}),
    });
  };

  return (
    <div className="p-4 border">
      <div>
        <h3>{props.product.name}</h3>
      </div>
      <div>
        <h3>Price {priceFormatter.format(props.unit_amount / 100)}</h3>
      </div>
      <div>
        {data?.user?.hasActivePackage ? null : (
          <button
            disabled={status === "loading"}
            onClick={handleOnSelect}
            className="btn-blue"
          >
            {status === "loading" ? (
              <Loading width={16} height={16} />
            ) : (
              "Select"
            )}
          </button>
        )}
      </div>
    </div>
  );
}

function Account() {
  const { data, status } = useSession();
  const router = useRouter();

  const mutation = useMutation(
    (payload) => createStripeCustomerPortal(payload),
    {
      onSuccess: (response) => {
        router.push(response.url);
      },
    }
  );

  const handleOnSelect = () => {
    mutation.mutate({
      customerId: data.user.stripeCustomerId,
      userId: data.user.id,
    });
  };

  return (
    <div className="p-4 border">
      <div>
        <h3>Account Management</h3>
      </div>
      <div>
        <button
          disabled={status === "loading"}
          onClick={handleOnSelect}
          className="btn-blue"
        >
          {status === "loading" ? (
            <Loading width={16} height={16} />
          ) : (
            "Manage Your Account"
          )}
        </button>
      </div>
    </div>
  );
}

function Pricing(props) {
  const { status } = useSession();
  return (
    <div className="w-full">
      <NextSeo
        title="Pricing &amp; Upgrade - DCA-CC"
        description="Select a plan that's right for you"
      />
      <main className="w-full bg-white dark:bg-gray-900">
        {status === "authenticated" && <Account />}
        {props.pricing.map((price) => (
          <PricingTab key={price.id} {...price} />
        ))}
      </main>

      <Footer availableTokens={props.availableTokens} />
    </div>
  );
}
