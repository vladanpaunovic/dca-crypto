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

const SignIn = ({ csrfToken, error, isEmailConfirmed, callbackUrl }) => {
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
      callbackUrl,
    });
  };

  return (
    <div className="flex bg-gray-50 dark:bg-gray-800">
      <div className="lg:w-1/2 xl:w-1/3  min-h-screen "></div>
      <div className="w-full lg:w-1/2 xl:w-1/3 min-h-screen flex items-center justify-center">
        <div className="max-w-lg w-full space-y-8 bg-white dark:bg-gray-900 border dark:border-gray-800 md:rounded-lg py-12 px-4 sm:px-6 lg:px-8 shadow-2xl h-full md:h-auto">
          <div>
            <Logo />
            {isEmailConfirmed && (
              <div className="bg-green-100 dark:bg-green-600 p-4 rounded-lg mt-10 flex items-center">
                <CheckCircleIcon className="w-10 h-10 text-green-800 dark:text-green-100 mr-4" />
                <div>
                  <h2 className="text-xl font-bold text-green-800 dark:text-white">
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
          <form
            className="space-y-6 form-reset"
            method="post"
            onSubmit={handleOnSubmit}
          >
            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
            <div className="rounded-md shadow-sm">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  autoFocus
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={state.email}
                  onChange={(e) =>
                    setState({ ...state, email: e.target.value })
                  }
                  required
                  className="focus:ring-1 rounded-none relative block w-full px-3 py-2 border dark:bg-gray-800 border-gray-300 dark:border-gray-700 placeholder-gray-500 text-gray-900 dark:text-white rounded-t-md sm:text-sm"
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
                  className="focus:ring-1 rounded-none relative block w-full px-3 py-2 border dark:bg-gray-800 border-gray-300 dark:border-gray-700 placeholder-gray-500 text-gray-900 dark:text-white rounded-b-md sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center"></div>

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
          </form>
        </div>
      </div>

      <div className="lg:w-1/2 xl:w-1/3  min-h-screen "></div>
    </div>
  );
};

// This is the recommended way for Next.js 9.3 or newer
export async function getServerSideProps(context) {
  const csrfToken = await getCsrfToken(context);
  return {
    props: {
      csrfToken: csrfToken || null,
      error: context.query.error || null,
      isEmailConfirmed: context.query.confirmed || false,
      callbackUrl: context.query.callbackUrl || "/dashboard",
    },
  };
}

export default SignIn;
