const FAQ = () => {
  return (
    <div className="max-w-screen-xl mx-auto p-8 bg-gray-100 dark:bg-gray-800">
      <h2 className="text-3xl font-extrabold leading-9 text-gray-900 dark:text-gray-100 mb-12">
        FAQs
      </h2>
      <ul className="flex items-start gap-8 flex-wrap">
        <li className="w-full md:w-2/5">
          <p className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">
            How can I cancel my subscription?
          </p>
          <p className="mt-2 space-y-4">
            <p className="text-base leading-6 text-gray-500 dark:text-gray-400">
              To cancel a recurring subscription just click stop auto-renewal
              from your account page.
            </p>
            <p className="text-base leading-6 text-gray-500 dark:text-gray-400">
              You can also email us on{" "}
              <a
                href="mailto:dcacryptocurrency@gmail.com
"
              >
                dcacryptocurrency@gmail.com
              </a>
              .
            </p>
            <p className="text-base leading-6 text-gray-500 dark:text-gray-400">
              The Week Pass plan is a one-time charge, not a recurring
              subscription. It does not automatically renew and downgrades to
              free after 7 days.
            </p>
          </p>
        </li>
        <li className="w-full md:w-2/5">
          <p className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">
            Will my subscription be automatically renewed?
          </p>
          <p className="mt-2 space-y-4">
            <p className="text-base leading-6 text-gray-500 dark:text-gray-400">
              The Week Pass is a one-time charge, not a recurring subscription.
              It does not automatically renew and downgrades to free after 7
              days.
            </p>
            <p className="text-base leading-6 text-gray-500 dark:text-gray-400">
              The Monthly and Annual plans are recurring subscriptions and will
              continue until you cancel.
            </p>
            <p className="text-base leading-6 text-gray-500 dark:text-gray-400">
              Subscriptions auto-renew at the end of each term and you will be
              charged for the subsequent term.
            </p>
          </p>
        </li>
        <li className="w-full md:w-2/5">
          <p className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">
            Can I cancel at any time?
          </p>
          <p className="mt-2 space-y-4">
            <p className="text-base leading-6 text-gray-500 dark:text-gray-400">
              You can cancel auto-renewal of your subscription at any time. The
              subscription will no longer auto-renew and it will cancel at the
              end of the current billing cycle.
            </p>
          </p>
        </li>
        <li className="w-full md:w-2/5">
          <p className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">
            Can I subscribe only one month / year?
          </p>
          <p className="mt-2 space-y-4">
            <p className="text-base leading-6 text-gray-500 dark:text-gray-400">
              Yes. Simply cancel auto-renewal immediately after signing up and
              you will only be charged for the current billing cycle.
            </p>
          </p>
        </li>
        <li className="w-full md:w-2/5">
          <p className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">
            What is DCA-CC?
          </p>
          <p className="mt-2 space-y-4">
            <p className="text-base leading-6 text-gray-500 dark:text-gray-400">
              DCA-CC is online browser-based set of tools, where you can make
              dollar cost averaging and lump sum investment calculations.
            </p>
          </p>
        </li>
        <li className="w-full md:w-2/5">
          <p className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">
            Can I use DCA-CC for free?
          </p>
          <p className="mt-2 space-y-4">
            <p className="text-base leading-6 text-gray-500 dark:text-gray-400">
              Yes. Free version of DCA-CC is not limited in anything but usage.
              Our free users can enjoy the same set of features, yet limited to
              making 5 calculations per hour.
            </p>
          </p>
        </li>
      </ul>
    </div>
  );
};

export default FAQ;
