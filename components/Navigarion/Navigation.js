import Logo from "../Logo/Logo";
import {
  ColorSwatchIcon,
  NewspaperIcon,
  CalculatorIcon,
} from "@heroicons/react/outline";
import { useSession, signIn, signOut } from "next-auth/react";
import { Fragment, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import {
  UserCircleIcon,
  LogoutIcon,
  CreditCardIcon,
} from "@heroicons/react/outline";
import Image from "next/image";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { createStripeCustomerPortal } from "../../src/queries";
import { useMutation } from "react-query";
import { classNames } from "../../styles/utils";
import Link from "next/link";

dayjs.extend(relativeTime);

const UnAuthenticatedMenu = () => (
  <>
    <div>
      <Link
        href="/blog"
        className="px-2 block font-medium text-gray-900 hover:opacity-70 transition"
      >
        Blog
      </Link>
    </div>

    <div>
      <Link
        href="/pricing"
        className="px-2 block font-medium text-gray-900 hover:opacity-70 transition"
      >
        Pricing
      </Link>
    </div>

    <div>
      <Link
        href="/dca/bitcoin"
        className="px-2 block font-medium text-gray-900 hover:opacity-70 transition"
      >
        DCA Calculator
      </Link>
    </div>
    <div>
      <Link
        href="/dca-last-9-years"
        className="px-2 block font-medium text-gray-900 hover:opacity-70 transition"
      >
        DCA last 9 years
      </Link>
    </div>
    <div>
      <Link
        href="/blog/the-benefits-of-dollar-cost-averaging-how-a-calculator-can-help-you-invest-smarter"
        className="px-2 block font-medium text-gray-900 hover:opacity-70 transition"
      >
        How to use a DCA calculator?
      </Link>
    </div>
    <div>
      <button
        onClick={() => signIn()}
        className="px-2 block font-medium text-gray-900 hover:opacity-70 transition"
      >
        Sign in
      </button>
    </div>
    <div>
      <Link
        href="/pricing"
        className="hidden sm:block px-3 py-2 ml-4 bg-gray-100 text-indigo-700 rounded font-medium shadow-lg transition hover:shadow-xl"
      >
        Register
      </Link>
    </div>
  </>
);

const PackageLabel = ({ user }) => {
  const isWeekPass = user.subscription?.type === "week_pass";

  if (isWeekPass) {
    return (
      <div>
        Week Pass, expires in {dayjs(user.subscription.ends_on).fromNow()}
      </div>
    );
  }

  return <div>Active Subscription</div>;
};

const AuthenticatedMenu = ({ session }) => {
  const { data } = useSession();
  const router = useRouter();
  const isWeekPass = data.user.subscription?.type === "week_pass";

  const isActiveSubscription = data.user.subscription?.type === "subscription";
  const showPricingButton =
    !data.user.subscription ||
    data.user.subscription?.status === "canceled" ||
    isWeekPass;

  const mutation = useMutation(
    (payload) => createStripeCustomerPortal(payload),
    {
      onSuccess: (response) => {
        router.push(response.url);
      },
    }
  );

  const handleOnAccountSettings = () => {
    mutation.mutate({
      userId: data.user.id,
      returnUrl: router.asPath,
    });
  };

  return (
    <>
      <div className="flex items-center">
        <Menu as="div" className="relative ml-3">
          <div>
            <Menu.Button
              title={session.user.email}
              className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              <span className="sr-only">Open user menu</span>
              <div className="h-8 w-8 rounded-full text-white">
                {session.user.image ? (
                  <Image
                    width={32}
                    height={32}
                    alt={session.user.email}
                    src={session.user.image}
                    className="rounded-full"
                  />
                ) : (
                  <UserCircleIcon />
                )}
              </div>
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-10 mt-2 w-60 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <Menu.Item>
                <div
                  className={classNames(
                    "rounded-t-md block text-xs px-4 py-2 text-smbet bg-indigo-600 text-gray-100 truncate overflow-ellipsis"
                  )}
                >
                  <p>Account:</p>
                  <p className="my-1">{session.user.email}</p>
                  {session.user.hasActivePackage && (
                    <>
                      <p className="my-1">
                        <PackageLabel user={session.user} />
                      </p>
                    </>
                  )}
                </div>
              </Menu.Item>
              {/* <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={classNames(
                      active ? "bg-gray-100" : "",
                      "block px-4 py-2 text-sm text-gray-700"
                    )}
                  >
                    <span className="flex items-center">
                      <CogIcon className="mr-1" width={16} height={16} />
                      Settings
                    </span>
                  </a>
                )}
              </Menu.Item> */}
              {isActiveSubscription && (
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleOnAccountSettings}
                      className={classNames(
                        active ? "bg-gray-100" : "",
                        "flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 rounded-b-md"
                      )}
                    >
                      <CreditCardIcon className="mr-1" width={16} height={16} />
                      Subscription Settings
                    </button>
                  )}
                </Menu.Item>
              )}
              {showPricingButton && (
                <Menu.Item>
                  {({ active }) => (
                    <div>
                      <Link
                        href="/pricing"
                        className={classNames(
                          active ? "bg-gray-100" : "",
                          "flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 rounded-b-md"
                        )}
                      >
                        <ColorSwatchIcon
                          className="mr-1"
                          width={16}
                          height={16}
                        />
                        Pricing
                      </Link>
                    </div>
                  )}
                </Menu.Item>
              )}

              <Menu.Item>
                {({ active }) => (
                  <div>
                    <Link
                      href="/blog"
                      className={classNames(
                        active ? "bg-gray-100" : "",
                        "flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 rounded-b-md"
                      )}
                    >
                      <NewspaperIcon className="mr-1" width={16} height={16} />
                      Blog
                    </Link>
                  </div>
                )}
              </Menu.Item>

              <Menu.Item>
                {({ active }) => (
                  <div>
                    <Link
                      href="/dca/bitcoin"
                      className={classNames(
                        active ? "bg-gray-100" : "",
                        "flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 rounded-b-md"
                      )}
                    >
                      <CalculatorIcon className="mr-1" width={16} height={16} />
                      DCA Calculator
                    </Link>
                  </div>
                )}
              </Menu.Item>

              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => signOut()}
                    className={classNames(
                      active ? "bg-gray-100" : "",
                      "flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 rounded-b-md"
                    )}
                  >
                    <LogoutIcon className="mr-1" width={16} height={16} />
                    Sign Out
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </>
  );
};

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <div className="flex justify-between mx-auto bg-white">
        <div>
          <Logo />
        </div>
        <div className="hidden space-x-2 lg:flex items-center">
          <UnAuthenticatedMenu />
        </div>
        <div className="flex lg:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="space-y-2">
            <span className="block w-8 h-0.5 bg-gray-600 animate-pulse"></span>
            <span className="block w-8 h-0.5 bg-gray-600 animate-pulse"></span>
            <span className="block w-8 h-0.5 bg-gray-600 animate-pulse"></span>
          </button>
        </div>
      </div>

      {isOpen && (
        <div className=" bg-black bg-opacity-50 z-50">
          <div className={`bg-white z-50`}>
            <div className="lg:hidden flex flex-col space-y-6 py-4">
              <UnAuthenticatedMenu />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Navigation = () => {
  const { status, data } = useSession();
  return (
    <header className="text-indigo-700 body-font shadow w-full bg-white px-4 py-2 sm:px-4 border-b">
      {status === "authenticated" ? (
        <div className="flex lg:justify-end lg:ml-0 items-center">
          <div className="flex justify-between items-center w-full">
            <Logo />

            <AuthenticatedMenu session={data} />
          </div>
        </div>
      ) : (
        <div>
          <HamburgerMenu />
        </div>
      )}
    </header>
  );
};

export default Navigation;
