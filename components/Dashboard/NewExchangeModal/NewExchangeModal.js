import { PlusCircleIcon, XIcon } from "@heroicons/react/outline";
import { useState } from "react";
import { Dialog } from "@headlessui/react";
import cmsClient from "../../../server/cmsClient";
import Loading from "../../Loading/Loading";
import { useMutation, useQuery } from "react-query";
import { useSession } from "next-auth/client";
import { queryClient } from "../../../pages/_app";
import InputBox from "../InputBox";

const BinanceForm = ({ exchange, onClose }) => {
  const [session] = useSession();
  const [state, setState] = useState({
    api_key: "",
    secret_key: "",
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: async (payload) =>
      await cmsClient(session.accessToken).post("/exchanges", payload),
    mutationKey: "add-exchange",
    onSettled: async () => {
      onClose();
      await queryClient.refetchQueries(["only-my-exchanges"]);
    },
  });

  const handleOnsubmit = async (e) => {
    e.preventDefault();

    const payload = {
      api_requirements: JSON.stringify(state),
      available_exchange: exchange._id,
      users_permissions_user: session.user._id,
    };

    mutate(payload);
  };

  return (
    <form onSubmit={handleOnsubmit}>
      <InputBox
        identifier="api_key"
        label="Api key"
        value={state.api_key}
        onChange={(e) => setState({ ...state, api_key: e.target.value })}
      />
      <InputBox
        identifier="secret_key"
        label="Secret key"
        value={state.secret_key}
        onChange={(e) => setState({ ...state, secret_key: e.target.value })}
      />

      <button
        type="submit"
        disabled={isLoading}
        className="flex py-1 px-4 bg-indigo-500 rounded text-gray-100"
      >
        {isLoading ? (
          <>
            <span className="mr-1">Submit</span>{" "}
            <Loading width={25} height={25} />
          </>
        ) : (
          "Submit"
        )}
      </button>
    </form>
  );
};

const CoinbaseProForm = ({ exchange, onClose }) => {
  const [session] = useSession();
  const [state, setState] = useState({
    api_key: "",
    secret_key: "",
    passphrase: "",
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: async (payload) =>
      await cmsClient(session.accessToken).post("/exchanges", payload),
    mutationKey: "add-exchange",
    onSettled: async () => {
      onClose();
      await queryClient.refetchQueries(["only-my-exchanges"]);
    },
  });

  const handleOnsubmit = async (e) => {
    e.preventDefault();

    const payload = {
      api_requirements: JSON.stringify(state),
      available_exchange: exchange._id,
      users_permissions_user: session.user._id,
    };

    mutate(payload);
  };

  return (
    <form onSubmit={handleOnsubmit}>
      <InputBox
        identifier="api_key"
        label="Api key"
        value={state.api_key}
        onChange={(e) => setState({ ...state, api_key: e.target.value })}
      />
      <InputBox
        identifier="secret_key"
        label="Secret key"
        value={state.secret_key}
        onChange={(e) => setState({ ...state, secret_key: e.target.value })}
      />
      <InputBox
        identifier="passphrase"
        label="Passphrase"
        value={state.passphrase}
        onChange={(e) => setState({ ...state, passphrase: e.target.value })}
      />
      <button
        type="submit"
        disabled={isLoading}
        className="flex py-1 px-4 bg-indigo-500 rounded text-gray-100"
      >
        {isLoading ? (
          <>
            <span className="mr-1">Submit</span>{" "}
            <Loading width={25} height={25} />
          </>
        ) : (
          "Submit"
        )}
      </button>
    </form>
  );
};

const CryptoComForm = ({ exchange, onClose }) => {
  const [session] = useSession();
  const [state, setState] = useState({
    api_key: "",
    secret_key: "",
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: async (payload) =>
      await cmsClient(session.accessToken).post("/exchanges", payload),
    mutationKey: "add-exchange",
    onSettled: async () => {
      onClose();
      await queryClient.refetchQueries(["only-my-exchanges"]);
    },
  });

  const handleOnsubmit = async (e) => {
    e.preventDefault();

    const payload = {
      api_requirements: JSON.stringify(state),
      available_exchange: exchange._id,
      users_permissions_user: session.user._id,
    };

    mutate(payload);
  };

  return (
    <form onSubmit={handleOnsubmit}>
      <InputBox
        identifier="api_key"
        label="Api key"
        value={state.api_key}
        onChange={(e) => setState({ ...state, api_key: e.target.value })}
      />
      <InputBox
        identifier="secret_key"
        label="Secret key"
        value={state.secret_key}
        onChange={(e) => setState({ ...state, secret_key: e.target.value })}
      />

      <button
        type="submit"
        disabled={isLoading}
        className="flex py-1 px-4 bg-indigo-500 rounded text-gray-100"
      >
        {isLoading ? (
          <>
            <span className="mr-1">Submit</span>{" "}
            <Loading width={25} height={25} />
          </>
        ) : (
          "Submit"
        )}
      </button>
    </form>
  );
};

const ExchangeForm = (props) => {
  const { exchange } = props;
  switch (exchange.identifier) {
    case "binance":
      return <BinanceForm {...props} />;
    case "coinbase-pro":
      return <CoinbaseProForm {...props} />;
    case "crypto-com":
      return <CryptoComForm {...props} />;
    default:
      return null;
  }
};

const NewExchangeForm = (props) => {
  const [exchange, setExchange] = useState({ _id: "choose-exchange" });
  const onlyMyExchanges = queryClient.getQueryData("only-my-exchanges");

  const myExchangeIds = new Set(
    onlyMyExchanges.map((a) => a.available_exchange._id)
  );

  const filtered = props.availableExchanges.filter(
    (ex) => !myExchangeIds.has(ex._id)
  );

  return (
    <div className="mt-8">
      <div className="col-span-2">
        <label className="block">
          <span className="font-medium text-gray-700 dark:text-gray-300">
            Select exchange
          </span>
          <div className="mt-1 flex rounded-md shadow-sm">
            <select
              name="coinId"
              value={exchange._id}
              onChange={(e) => {
                const selectedExchange = filtered.find(
                  (ex) => ex._id === e.target.value
                );
                setExchange(selectedExchange);
              }}
              className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded sm:text-sm border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
            >
              <option value="choose-exchange" disabled>
                Choose exchange
              </option>
              {filtered.map((exchange) => (
                <option key={exchange._id} value={exchange._id}>
                  {exchange.label}
                </option>
              ))}
            </select>
          </div>
        </label>
        <div className="mt-4">
          {exchange && <ExchangeForm exchange={exchange} {...props} />}
        </div>
      </div>
    </div>
  );
};

const NewExchangeModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data, isLoading } = useQuery("my-exchanges", async () => {
    const response = await cmsClient().get("/available-exchanges");
    return response.data;
  });

  return (
    <>
      {isLoading ? (
        <div className="p-1">
          <Loading width={25} height={25} />
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full focus:outline-none flex items-center text-gray-200 dark:text-gray-600 dark:border-gray-700 hover:text-gray-900 dark:hover:text-gray-100 transition rounded"
        >
          <PlusCircleIcon className="w-8 h-8 mr-2" />
          Connect exchange
        </button>
      )}

      <div className="relative">
        <Dialog
          open={isOpen}
          onClose={() => setIsOpen(false)}
          className="fixed z-10 inset-0 overflow-y-auto text-center"
        >
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-90 " />
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <div className="inline-block relative align-middle rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-xl sm:w-full">
            <div className="bg-white dark:bg-gray-900 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div>
                <div className="mt-6">
                  <h3
                    className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100"
                    id="modal-title"
                  >
                    Connect new exchange
                  </h3>
                  <div className="mt-2">
                    <NewExchangeForm
                      onClose={() => setIsOpen(false)}
                      availableExchanges={data}
                    />
                  </div>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 w-full inline-flex justify-center border-gray-300 dark:border-gray-800 dark:bg-gray-900 p-2 bg-white text-base font-medium text-gray-700 dark:text-yellow-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>
        </Dialog>
      </div>
    </>
  );
};

export default NewExchangeModal;
