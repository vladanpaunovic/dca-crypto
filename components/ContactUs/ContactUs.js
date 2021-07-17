import { useEffect, useRef, useState } from "react";
import { ReCaptcha, loadReCaptcha } from "react-recaptcha-v3";
import { GOOGLE_RECAPTCHA_CLIENT_KEY } from "../../config";
import { useContactUsMutation } from "../../queries/queries";
import { MailIcon, MailOpenIcon } from "@heroicons/react/outline";

const ContactUs = () => {
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [isSent, setIsSent] = useState(false);
  const [state, setState] = useState({ email: "", message: "", name: "" });

  const recaptcha = useRef();

  const verifyCallback = (token) => {
    setRecaptchaToken(token);
  };

  const contactUsMutation = useContactUsMutation();

  useEffect(() => {
    loadReCaptcha(GOOGLE_RECAPTCHA_CLIENT_KEY, verifyCallback);
  }, []);

  useEffect(() => {
    if (!!contactUsMutation.data) {
      setIsSent(true);
    }
  }, [contactUsMutation.data]);

  const updateToken = () => {
    recaptcha.current.execute();
  };

  const handleOnSubmit = async (e) => {
    await recaptcha.current.execute();
    e.preventDefault();
    updateToken();

    // mutate
    contactUsMutation.mutate({ ...state, token: recaptchaToken });
  };

  return (
    <div className="md:flex border dark:border-gray-800">
      <div className="w-full md:w-5/12 bg-gray-100 dark:bg-gray-800 p-8">
        <h1 className="leading-5 text-3xl font-extrabold">Get in touch</h1>
        <p className="mt-4 text-gray-400 font-medium">
          If you have questions or you need some sort of support - we are here
          to help.
        </p>
        <p className="mt-4 text-gray-400 font-medium">
          Please, keep in mind that we can't solve your issues with your
          exchanges as we have no power of authority there, but we promise to do
          our best to provide good answers on questions regarding our platform.
        </p>
      </div>
      <div className="w-full md:w-7/12 bg-white dark:bg-gray-900 p-8">
        <form className="min-w-screen" onSubmit={handleOnSubmit}>
          <div className="">
            <label className="block mb-3">
              <span className="font-medium text-sm text-gray-700 dark:text-gray-300">
                Full name
              </span>
              <input
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                type="text"
                autoComplete="name"
                required
                value={state.name}
                onChange={(e) => setState({ ...state, name: e.target.value })}
              />
            </label>

            <label className="block mb-3">
              <span className="font-medium text-sm text-gray-700 dark:text-gray-300">
                E-mail
              </span>
              <input
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                type="text"
                autoComplete="email"
                required
                value={state.email}
                onChange={(e) => setState({ ...state, email: e.target.value })}
              />
            </label>

            <label className="block mb-3">
              <span className="font-medium text-sm text-gray-700 dark:text-gray-300">
                Message
              </span>
              <textarea
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                required
                rows={3}
                onChange={(e) =>
                  setState({ ...state, message: e.target.value })
                }
                value={state.message}
              />
            </label>
            <div className="mt-8">
              {isSent ? (
                <div className="p-4 bg-indigo-500 dark:bg-yellow-500 rounded-lg text-white dark:text-gray-900 flex items-center">
                  <MailOpenIcon className="w-5 h-5 mr-1" /> Message sent. We
                  will get back to you.
                </div>
              ) : (
                <div className="inline-block">
                  <button
                    type="submit"
                    disabled={contactUsMutation.isLoading}
                    className={`${
                      contactUsMutation.isLoading && "animate-pulse"
                    } flex justify-center items-center rounded font-medium bg-indigo-500 dark:bg-yellow-500 px-4 py-2 text-white dark:text-gray-900 w-full`}
                  >
                    {contactUsMutation.isLoading
                      ? "Sending..."
                      : "Send message"}
                    <span className="ml-1">
                      {contactUsMutation.isLoading ? (
                        <MailOpenIcon className="w-5 h-5" />
                      ) : (
                        <MailIcon className="w-5 h-5" />
                      )}
                    </span>
                  </button>
                </div>
              )}
            </div>
            <ReCaptcha
              ref={recaptcha}
              sitekey={GOOGLE_RECAPTCHA_CLIENT_KEY}
              action="register"
              verifyCallback={verifyCallback}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
