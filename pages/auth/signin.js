import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  LockClosedIcon,
} from "@heroicons/react/solid";
import Logo from "../../components/Logo/Logo";
import Link from "next/link";
import { getCsrfToken } from "next-auth/client";
import { signIn } from "next-auth/client";
import { useState } from "react";
import Loading from "../../components/Loading/Loading";

const SignIn = ({ csrfToken, error, isEmailConfirmed }) => {
  const [state, setState] = useState({
    email: "",
    password: "",
    loading: false,
  });

  const handleOnSubmit = (e) => {
    e.preventDefault();
    setState({ ...state, loading: true });

    return signIn("credentials", {
      email: state.email,
      password: state.password,
      callbackUrl: "/dashboard",
    });
  };

  return (
    <div className="flex">
      <div className="w-full md:w-1/3 min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <Logo />
            {isEmailConfirmed && (
              <div className="bg-green-100 dark:bg-green-600 p-4 rounded-lg mt-10 flex items-center">
                <CheckCircleIcon className="w-10 h-10 text-green-800 dark:text-green-100 mr-4" />
                <div>
                  <h2 className="text-2xl font-bold text-green-800 dark:text-white">
                    Welcome to DCA-CC.com
                  </h2>
                  <p className="text-green-800 dark:text-green-100">
                    Your email is successfully verified.
                  </p>
                </div>
              </div>
            )}
            <h2 className="mt-10 text-3xl font-extrabold text-gray-900 dark:text-gray-100">
              Sign in to your account
            </h2>
          </div>
          <form className="space-y-6" method="post" onSubmit={handleOnSubmit}>
            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={state.email}
                  onChange={(e) =>
                    setState({ ...state, email: e.target.value })
                  }
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border dark:bg-gray-800 border-gray-300 dark:border-gray-700 placeholder-gray-500 text-gray-900 dark:text-white rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={state.password}
                  onChange={(e) =>
                    setState({ ...state, password: e.target.value })
                  }
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border dark:bg-gray-800 border-gray-300 dark:border-gray-700 placeholder-gray-500 text-gray-900 dark:text-white rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {/* <input
                  id="remember_me"
                  name="remember_me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember_me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Remember me
                </label> */}
              </div>

              <div className="text-sm">
                <Link href="/auth/forgot-password">
                  <a className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-yellow-600 dark:hover:text-yellow-500">
                    Forgot your password?
                  </a>
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group flex relative w-full items-center justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white dark:text-gray-900 bg-indigo-600 hover:bg-indigo-700 dark:bg-yellow-500 dark:hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign in{" "}
                {state.loading && (
                  <span className="ml-1">
                    <Loading width={20} height={20} />
                  </span>
                )}
              </button>
            </div>
            {error && (
              <p className="rounded p-2 bg-red-100 dark:bg-gray-800 dark:text-red-400 mt-4 flex items-center">
                <span className="p-3 bg-red-500 dark:bg-red-500 rounded mr-2">
                  <ExclamationCircleIcon className="w-5 h-5 text-red-200 dark:text-gray-700" />
                </span>
                {error}
              </p>
            )}
            <p className="rounded p-2 bg-gray-100 dark:bg-gray-800 dark:text-gray-400 mt-4 flex items-center">
              <span className="p-3 bg-indigo-500 dark:bg-yellow-500 rounded mr-2">
                <LockClosedIcon className="w-5 h-5 text-gray-200 dark:text-gray-700" />
              </span>
              Registration is available only by invite from existing members of
              the platform.
            </p>
          </form>
        </div>
      </div>
      <div className="md:w-2/3 pattern-domino bg-gray-50 dark:bg-gray-900"></div>
    </div>
  );
};

// This is the recommended way for Next.js 9.3 or newer
export async function getServerSideProps(context) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
      error: context.query.error || null,
      isEmailConfirmed: context.query.confirmed || false,
    },
  };
}

export default SignIn;
