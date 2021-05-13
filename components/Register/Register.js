import {
  UserIcon,
  InboxIcon,
  EyeIcon,
  EyeOffIcon,
} from "@heroicons/react/outline";
import { MailOpenIcon } from "@heroicons/react/solid";
import { useState } from "react";
import LoginIllustration from "../../Illustrations/LoginIllustration";
import cmsClient from "../../server/cmsClient";
import Loading from "../Loading/Loading";
import Link from "next/link";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsRegistered(false);
    setIsLoading(true);

    try {
      const response = await cmsClient().post("/users", {
        username: name,
        password,
        email,
      });

      if (response.data._id) {
        setIsRegistered(true);
        setIsLoading(false);
      }
    } catch (e) {
      setError(e.response.data.message[0].messages[0].message);
    }
  };
  return (
    <form
      className="min-w-screen min-h-screen bg-gray-100 pattern-domino dark:bg-gray-900 flex items-center justify-center px-5 py-5"
      onSubmit={handleOnSubmit}
      disabled={isLoading}
    >
      <div className=" text-gray-500 rounded-3xl shadow-xl w-full overflow-hidden max-w-4xl bg-white dark:bg-gray-900">
        <div className="md:flex w-full">
          <div className="hidden md:flex items-center justify-center w-1/2 bg-gradient-to-r from-indigo-500 to-indigo-600 dark:from-yellow-400 dark:to-yellow-500 py-10 px-10 fill-current">
            <LoginIllustration />
          </div>
          <div className="w-full md:w-1/2 py-10 px-5 md:px-10">
            {isRegistered ? (
              <div className="w-full h-full flex items-center justify-center flex-col ">
                <span className="rounded-full bg-green-300 p-3">
                  <MailOpenIcon className="text-white dark:text-gray-900 w-10 h-10" />
                </span>
                <h3 className="text-2xl leading-6 font-semibold text-gray-900 dark:text-gray-100 mt-4">
                  Verify your email
                </h3>
                <p className="text-gray-400 dark:text-gray-100 mt-2">
                  Check your inbox to confirm your email
                </p>
              </div>
            ) : (
              <>
                <div className="text-center mb-10">
                  <h1 className="font-bold text-3xl text-gray-900 dark:text-gray-100">
                    Register
                  </h1>
                  <p className="text-gray-500 dark:text-gray-100">
                    Start dollar cost avereging now
                  </p>
                </div>
                <div>
                  <div className="flex ">
                    <div className="w-full px-3 mb-3">
                      <label
                        htmlFor=""
                        className="text-xs font-semibold px-1 text-gray-500 dark:text-gray-100"
                      >
                        Name
                      </label>
                      <div className="flex">
                        <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                          <UserIcon className="text-gray-400 w-5 h-5" />
                        </div>
                        <input
                          value={name}
                          autoFocus
                          onChange={(e) => setName(e.target.value)}
                          type="text"
                          className=" w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-800 dark:text-gray-100 "
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex ">
                    <div className="w-full px-3 mb-3">
                      <label
                        htmlFor=""
                        className="text-xs font-semibold px-1 text-gray-500 dark:text-gray-100"
                      >
                        Email
                      </label>
                      <div className="flex">
                        <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                          <InboxIcon className="text-gray-400 w-5 h-5" />
                        </div>
                        <input
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          type="email"
                          className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-800 dark:text-gray-100"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex ">
                    <div className="w-full px-3 mb-12">
                      <label
                        htmlFor=""
                        className="text-xs font-semibold px-1 text-gray-500 dark:text-gray-100"
                      >
                        Password
                      </label>
                      <div className="flex">
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="w-10 z-10 pl-1 text-center flex items-center justify-center focus:outline-none transition-all"
                        >
                          {showPassword ? (
                            <EyeOffIcon className="text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 w-5 h-5" />
                          ) : (
                            <EyeIcon className="text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 w-5 h-5" />
                          )}
                        </button>
                        <input
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          type={showPassword ? "text" : "password"}
                          className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-800 dark:text-gray-100"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex  flex-col px-3">
                    <div className="w-full">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="flex items-center justify-center w-full hover:opacity-80 mx-auto bg-indigo-600 dark:bg-yellow-500 text-white dark:text-gray-900 rounded-lg px-3 py-3 font-semibold"
                      >
                        REGISTER NOW{" "}
                        {isLoading && (
                          <span className="ml-1">
                            <Loading width={20} height={20} />
                          </span>
                        )}
                      </button>
                    </div>
                    {error && (
                      <p className="text-gray-50 bg-red-500 p-4 rounded-md">
                        {error}
                      </p>
                    )}

                    <p className="text-center mt-4">
                      Have an account?{" "}
                      <Link href="/auth/signin">
                        <a className="text-indigo-500 hover:underline">
                          Sign in
                        </a>
                      </Link>
                      .
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </form>
  );
};

export default Register;
