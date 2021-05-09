import Loading from "../../components/Loading/Loading";
import { useMutation } from "react-query";
import { useState } from "react/cjs/react.development";
import Logo from "../../components/Logo/Logo";
import cmsClient from "../../server/cmsClient";
import {
  ExclamationIcon,
  InformationCircleIcon,
} from "@heroicons/react/outline";

const ForgotPassword = () => {
  const [userEmail, setUserEmail] = useState("");
  const [isSuccessful, setIsSuccessfull] = useState(false);
  const [responseError, setResponseError] = useState(null);

  const resetPassword = useMutation({
    mutationKey: "reset-password",
    mutationFn: async ({ email }) => {
      setResponseError(null);
      setIsSuccessfull(false);
      try {
        const response = await cmsClient().post(
          "/auth/forgot-password",
          {
            email,
          },
          { headers: { "Content-type": "application/json" } }
        );

        return response.data;
      } catch ({ response }) {
        setResponseError(response.data.message[0].messages[0].message);
      }
    },
    onSuccess: (data) => {
      setIsSuccessfull(true);
    },
  });

  const handleOnSubmit = (e) => {
    e.preventDefault();

    resetPassword.mutate({ email: userEmail });
  };

  return (
    <div className="flex">
      <div className="w-full md:w-1/3 min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <Logo />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-gray-100">
              Forgot password
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleOnSubmit}>
            <div className="rounded-md shadow-sm">
              <div>
                <label
                  htmlFor="email-address"
                  className="text-gray-800 dark:text-gray-500 font-medium"
                >
                  Email
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="mt-1 appearance-none rounded relative block w-full px-3 py-2 border dark:bg-gray-800 border-gray-300 dark:border-gray-700 placeholder-gray-500 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="johndoe@example.com"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white dark:text-gray-900 bg-indigo-600 hover:bg-indigo-700 dark:bg-yellow-500 dark:hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {resetPassword.isLoading ? (
                  <Loading width={20} height={20} />
                ) : (
                  "Reset password"
                )}
              </button>
            </div>
            {isSuccessful && (
              <p className="bg-green-600 p-2 rounded flex items-center">
                <InformationCircleIcon className="w-5 h-5 mr-2" />
                The reset password link has been sent to your email.
              </p>
            )}
            {responseError && (
              <p className="bg-red-600 p-2 rounded flex items-center">
                <ExclamationIcon className="w-5 h-5 mr-2" />
                {responseError}
              </p>
            )}
          </form>
        </div>
      </div>
      <div className="md:w-2/3 pattern-domino bg-gray-50 dark:bg-gray-900"></div>
    </div>
  );
};

export async function getServerSideProps(context) {
  return {
    props: {},
  };
}

export default ForgotPassword;
