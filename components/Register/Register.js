import {
  UserIcon,
  InboxIcon,
  LockClosedIcon,
  CheckIcon,
} from "@heroicons/react/outline";
import { useState } from "react";
import LoginIllustration from "../../Illustrations/LoginIllustration";
import apiClient from "../../server/apiClient";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [hasError, setHasError] = useState(null);

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setHasError(false);
    setIsRegistered(false);

    const response = await apiClient.post("/register", {
      name,
      password,
      email,
    });

    if (response.data.success) {
      setIsRegistered(true);
    } else {
      setHasError(response.statusText);
    }
  };
  return (
    <form
      className="min-w-screen min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center px-5 py-5"
      onSubmit={handleOnSubmit}
    >
      <div className=" text-gray-500 rounded-3xl shadow-xl border dark:border-gray-700 w-full overflow-hidden max-w-4xl bg-white dark:bg-gray-900">
        <div className="md:flex w-full">
          <div className="hidden md:flex items-center justify-center w-1/2 bg-indigo-600 dark:bg-yellow-500 py-10 px-10 fill-current">
            <LoginIllustration />
          </div>
          <div className="w-full md:w-1/2 py-10 px-5 md:px-10">
            {isRegistered ? (
              <div className="w-full h-full flex items-center justify-center flex-col">
                <CheckIcon className="rounded-full bg-green-300 text-white dark:text-gray-900 w-12 h-12" />
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100 mt-6">
                  Success!
                </h3>
                <p className="text-gray-100 dark:text-gray-400">
                  You can now sign in
                </p>
              </div>
            ) : (
              <>
                <div className="text-center mb-10">
                  <h1 className="font-bold text-3xl text-gray-900 dark:text-gray-100">
                    Register
                  </h1>
                  <p className="text-gray-500 dark:text-gray-100">
                    Enter your information to register
                  </p>
                </div>
                <div>
                  <div className="flex -mx-3">
                    <div className="w-full px-3 mb-5">
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
                          onChange={(e) => setName(e.target.value)}
                          type="text"
                          className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500"
                          placeholder="John Smith"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex -mx-3">
                    <div className="w-full px-3 mb-5">
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
                          className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500"
                          placeholder="johnsmith@example.com"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex -mx-3">
                    <div className="w-full px-3 mb-12">
                      <label
                        htmlFor=""
                        className="text-xs font-semibold px-1 text-gray-500 dark:text-gray-100"
                      >
                        Password
                      </label>
                      <div className="flex">
                        <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                          <LockClosedIcon className="text-gray-400 w-5 h-5" />
                        </div>
                        <input
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          type="password"
                          className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500"
                          placeholder="************"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex -mx-3 flex-col px-3">
                    <div className="w-full mb-5 ">
                      <button
                        type="submit"
                        className="block w-full hover:opacity-80 mx-auto bg-indigo-600 dark:bg-yellow-500 text-white dark:text-gray-900 rounded-lg px-3 py-3 font-semibold"
                      >
                        REGISTER NOW
                      </button>
                    </div>
                    {hasError && (
                      <p className="text-gray-50 bg-red-500 p-4 rounded-md">
                        User with such email already exists in our database. Try
                        another one.
                      </p>
                    )}
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