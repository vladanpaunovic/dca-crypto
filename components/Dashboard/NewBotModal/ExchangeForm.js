import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/outline";
import { useSession } from "next-auth/client";
import { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { useAddExchange } from "../../../queries/queries";
import apiClient from "../../../server/apiClient";
import { useDashboardContext } from "../../DashboardContext/DashboardContext";
import { ACTIONS } from "../../DashboardContext/dashboardReducer";
import Loading from "../../Loading/Loading";
import InputBox from "../InputBox";
import ReactMarkdown from "react-markdown";

import { Popover, Transition } from "@headlessui/react";

function Instrutions(props) {
  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button
            title="How to get API keys?"
            className="focus:outline-none flex items-center justify-between text-xs leading-5 font-semibold rounded-full"
          >
            API keys
            <span>
              <QuestionMarkCircleIcon className="w-5 h-5 ml-1" />
            </span>
          </Popover.Button>
          <Transition
            show={open}
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Popover.Panel className="absolute z-10 w-screen px-4 transform -translate-x-2/2 right-1/2 max-w-sm">
              <div className="p-4 bg-white dark:bg-gray-900 rounded border dark:border-gray-700 shadow max-w-sm">
                <h4 className="text-normal font-medium mb-2">Instructions</h4>
                <div className="mb-2 text-gray-600 dark:text-gray-300">
                  <ReactMarkdown
                    components={{
                      ol: ({ node, ...props }) => (
                        <ol {...props} className="list-decimal list-inside" />
                      ),
                    }}
                  >
                    {props.exchange.instructions}
                  </ReactMarkdown>
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
}

const ExchangeForm = ({ exchange }) => {
  const { dispatch } = useDashboardContext();
  const [session] = useSession();
  const [authError, setAuthError] = useState(null);
  const [state, setState] = useState({
    api_key: "",
    secret_key: "",
    ...(exchange.hasPassword ? { passphrase: "" } : {}),
    ...(exchange.hasUUID ? { uuid: "" } : {}),
  });

  const addExchange = useAddExchange();

  const validateCredentials = useMutation({
    mutationFn: async (payload) =>
      await apiClient.post(
        `/exchanges/${exchange.identifier}/validate-credentials`,
        payload
      ),
    mutationKey: "validate-exchange-access",
    onSuccess: async (data) => {
      if (data.data.validated) {
        const payload = {
          api_requirements: JSON.stringify(state),
          available_exchange: exchange._id,
          users_permissions_user: session.user._id,
        };
        addExchange.mutate(payload);
      }
    },
  });

  const handleOnsubmit = async (e) => {
    e.preventDefault();
    setAuthError(null);

    validateCredentials.mutate({ credentials: JSON.stringify(state) });
  };

  useEffect(() => {
    if (validateCredentials.data?.data?.validated === false) {
      setAuthError(validateCredentials.data.data.error.name);
    }
  }, [validateCredentials.data]);

  return (
    <>
      <form onSubmit={handleOnsubmit}>
        <div className="bg-white dark:bg-gray-900 px-4 pt-5 rounded-t-lg pb-4 sm:p-6 sm:pb-4 ">
          <div>
            <div className="mt-2">
              <h3
                className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100"
                id="modal-title"
              >
                Add new API keys
              </h3>
              <div>
                <div>
                  <div className="flex items-center my-6 justify-between">
                    <div className="flex items-center">
                      <img
                        src={`${process.env.NEXT_PUBLIC_CMS_URL}${exchange.logo.url}`}
                        width={10}
                        height={10}
                        className="w-5 h-5 rounded-full mr-2"
                        alt={exchange.label}
                      />
                      <h3 className="leading-6 font-medium font-lg">
                        {exchange.label}
                      </h3>
                    </div>
                    <Instrutions exchange={exchange} />
                  </div>

                  <label className="block mb-3">
                    <span className="font-medium text-gray-700 text-sm dark:text-gray-300 font-sm">
                      API key
                    </span>
                    <textarea
                      spellCheck={false}
                      rows={2}
                      className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                      required
                      value={state.api_key}
                      onChange={(e) =>
                        setState({ ...state, api_key: e.target.value })
                      }
                    />
                  </label>

                  <label className="block mb-3">
                    <span className="font-medium text-gray-700 text-sm dark:text-gray-300 font-sm">
                      API secret
                    </span>
                    <textarea
                      spellCheck={false}
                      rows={2}
                      className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                      required
                      value={state.secret_key}
                      onChange={(e) =>
                        setState({ ...state, secret_key: e.target.value })
                      }
                    />
                  </label>

                  {exchange.hasPassword && (
                    <InputBox
                      identifier="passphrase"
                      label="Passphrase"
                      value={state.passphrase}
                      onChange={(e) =>
                        setState({ ...state, passphrase: e.target.value })
                      }
                    />
                  )}
                  {exchange.hasUUID && (
                    <InputBox
                      identifier="uuid"
                      label="UUID"
                      value={state.uuid}
                      onChange={(e) =>
                        setState({ ...state, uuid: e.target.value })
                      }
                    />
                  )}

                  {authError && (
                    <p className="bg-red-500 rounded p-2 text-white text-sm mt-4 flex items-center">
                      <ExclamationCircleIcon className="w-5 h-5 mr-1" />
                      {authError}
                    </p>
                  )}

                  {validateCredentials.isSuccess && !authError && (
                    <p className="bg-green-500 rounded p-2 text-white text-sm mt-4 flex items-center">
                      <CheckCircleIcon className="w-5 h-5 mr-1" />
                      API keys validated with {exchange.label}. Saving...
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 rounded-b-lg dark:bg-gray-800 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            type="submit"
            disabled={addExchange.isLoading || validateCredentials.isLoading}
            className="transition disabled:opacity-50 mt-3 w-full inline-flex justify-center rounded-md dark:bg-yellow-500 shadow-sm px-4 py-2 bg-indigo-500 text-base font-medium text-white dark:text-gray-900 hover:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Add API keys{" "}
            {(addExchange.isLoading || validateCredentials.isLoading) && (
              <span className="ml-1">
                <Loading width={20} height={20} />
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() =>
              dispatch({
                type: ACTIONS.CLEAR_NEW_EXCHANGE,
              })
            }
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-800 dark:bg-gray-900 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 dark:text-yellow-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Back
          </button>
        </div>
      </form>
    </>
  );
};

export default ExchangeForm;
