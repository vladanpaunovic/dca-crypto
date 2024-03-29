export default function Hero() {
  return (
    <div className="relative bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-0 sm:pb-8 bg-white lg:max-w-5xl lg:w-full ">
          <svg
            className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2"
            fill="currentColor"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <polygon points="50,0 100,0 50,100 0,100" />
          </svg>

          <div className="relative pt-6 pl-4">
            <nav
              className="relative flex items-center justify-between sm:h-10 lg:justify-start"
              aria-label="Global"
            >
              <div className="flex items-center flex-grow flex-shrink-0 lg:flex-grow-0"></div>
            </nav>
          </div>

          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block xl:inline">
                  Select a coin to calculate
                </span>{" "}
                <span className="block text-indigo-600 xl:inline">DCA</span>
              </h1>
              {/* <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Dollar-cost averaging (DCA) is an investment strategy in which
                an investor divides up the total amount to be invested across
                periodic purchases of a target asset in an effort to reduce the
                impact of volatility on the overall purchase (
                <a
                  href="https://www.investopedia.com/terms/d/dollarcostaveraging.asp"
                  target="_blank"
                  rel="nofollow"
                  className="underline"
                >
                  source
                </a>
                )
              </p> */}
            </div>
          </main>
        </div>
      </div>
      <div className="lg:absolute pattern-domino lg:inset-y-0 lg:right-0 lg:w-1/3"></div>
    </div>
  );
}
