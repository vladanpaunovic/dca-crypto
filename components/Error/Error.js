import { ExclamationIcon } from "@heroicons/react/solid";

const ErrorComponent = ({ error }) => {
  return (
    <div className="bg-indigo-200 rounded-lg">
      <div className="py-6 px-3 sm:px-6 lg:px-6 ">
        <div className="flex flex-wrap flex-col md:flex-row items-center justify-between">
          <div className="flex md:w-0 flex-1 items-center">
            <span className="flex rounded-lg bg-indigo-400 p-2">
              <ExclamationIcon
                className="h-6 w-6 text-indigo-900 "
                aria-hidden="true"
              />
            </span>
            <div className="ml-3 font-medium text-gray-900">
              <p className="font-bold">
                <span className="md:hidden">Limit reached.</span>
                <span className="hidden md:inline">{error.message}</span>
              </p>
              <p className="text-gray-900">{error.subheading}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorComponent;
