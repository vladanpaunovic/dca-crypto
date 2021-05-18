import {
  UserIcon,
  InboxIcon,
  EyeIcon,
  EyeOffIcon,
  RefreshIcon,
} from "@heroicons/react/outline";
import { MailOpenIcon } from "@heroicons/react/solid";
import { useEffect, useRef, useState } from "react";
import LoginIllustration from "../../Illustrations/LoginIllustration";
import cmsClient from "../../server/cmsClient";
import Loading from "../Loading/Loading";
import Link from "next/link";
import { ReCaptcha, loadReCaptcha } from "react-recaptcha-v3";
import { GOOGLE_RECAPTCHA_CLIENT_KEY } from "../../config";
import {
  useResendEmailConfirmation,
  useValidateReferralCode,
} from "../../queries/queries";

const Referral = ({ referralCode }) => {
  const validateReferralCode = useValidateReferralCode(referralCode);

  let output;
  if (validateReferralCode.isLoading) {
    output = <Loading width={20} height={20} withWrapper />;
  }

  if (validateReferralCode.error) {
    output = <p>{validateReferralCode.error.response.data.message}</p>;
  }

  if (validateReferralCode.data) {
    output = (
      <>
        <p>$25 from {validateReferralCode.data.username}</p>
        <p>Create an account and claim your credit</p>
      </>
    );
  }

  return (
    <div className="bg-indigo-500 dark:bg-yellow-500 p-4 rounded mb-8 text-white dark:text-gray-900">
      {output}
    </div>
  );
};

const Register = ({ referralCode }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState(null);

  const recaptcha = useRef();
  const resendEmailConfirmation = useResendEmailConfirmation();

  useEffect(() => {
    loadReCaptcha(GOOGLE_RECAPTCHA_CLIENT_KEY, verifyCallback);
  }, []);

  const verifyCallback = (token) => {
    setRecaptchaToken(token);
  };

  const updateToken = () => {
    recaptcha.current.execute();
  };

  const handleOnSubmit = async (e) => {
    await recaptcha.current.execute();
    e.preventDefault();
    setError(null);
    setIsRegistered(false);
    setIsLoading(true);
    updateToken();

    try {
      const response = await cmsClient().post("/auth/local/register", {
        username: name,
        password,
        email,
        token: recaptchaToken,
        ...(referralCode ? { referralCode } : {}),
      });

      setIsLoading(false);
      if (response.data.user) {
        setIsRegistered(true);
      }
    } catch (e) {
      setError(e.response.data.message[0].messages[0].message);
    }

    setIsLoading(false);
  };

  const handleOnResendEmail = () => {
    resendEmailConfirmation.mutate({ email });
  };

  return (
    <form
      className="min-w-screen min-h-screen bg-gray-100 pattern-domino dark:bg-gray-900 flex items-center justify-center px-5 py-5"
      onSubmit={handleOnSubmit}
      disabled={isLoading || isRegistered}
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
                <div className="flex items-center mt-8">
                  <p className="text-gray-400 dark:text-gray-400">
                    Didn't receive email?
                  </p>
                  <button
                    onClick={handleOnResendEmail}
                    type="button"
                    className="ml-1 transition hover:opacity-50 text-indigo-500 dark:text-yellow-500 flex items-center"
                  >
                    Send again{" "}
                    {resendEmailConfirmation.isLoading ? (
                      <span className="ml-1">
                        <Loading width={20} height={20} />
                      </span>
                    ) : (
                      <RefreshIcon className="ml-1 w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="text-center mb-10">
                  {referralCode && <Referral referralCode={referralCode} />}
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
                    <div className="w-full px-3 mb-3">
                      <label
                        htmlFor=""
                        className="text-xs font-semibold px-1 text-gray-500 dark:text-gray-100"
                      >
                        Password
                      </label>
                      <div className="flex">
                        <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                          {!showPassword ? (
                            <EyeOffIcon className="text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 w-5 h-5" />
                          ) : (
                            <EyeIcon className="text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 w-5 h-5" />
                          )}
                        </div>
                        <input
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          type={showPassword ? "text" : "password"}
                          className="w-full -ml-10 pl-10 pr-14 -mr-14 py-2 rounded-lg outline-none focus:border-indigo-500 dark:border-gray-800 border-gray-200 border-2 dark:bg-gray-700 dark:text-gray-100"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="w-14 dark:bg-gray-700 text-sm font-medium text-gray-80 dark:text-gray-300 rounded-r-lg px-2 z-10 text-center flex items-center justify-center focus:outline-none transition-all border-2 border-gray-200 dark:border-gray-800"
                        >
                          Show
                        </button>
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

                    <ReCaptcha
                      ref={recaptcha}
                      sitekey={GOOGLE_RECAPTCHA_CLIENT_KEY}
                      action="register"
                      verifyCallback={verifyCallback}
                    />
                    {error && (
                      <p className="mt-3 text-gray-50 bg-red-500 p-4 rounded-md">
                        {error}
                      </p>
                    )}

                    <p className="text-center mt-4">
                      Have an account?{" "}
                      <Link href="/auth/signin">
                        <a className="text-indigo-500 dark:text-yellow-500 hover:underline">
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
