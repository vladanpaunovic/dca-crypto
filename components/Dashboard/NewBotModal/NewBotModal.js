import { PlusCircleIcon } from "@heroicons/react/outline";
import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { useEffect } from "react";
import cmsClient from "../../../server/cmsClient";
import Loading from "../../Loading/Loading";

const NewBotForm = (props) => {
  const [exchange, setExchange] = useState();

  return (
    <form className="mt-8">
      <div className="col-span-2">
        <label className="block">
          <span className="font-medium text-gray-700 dark:text-gray-300">
            Select exchange
          </span>
          <div className="mt-1 flex rounded-md shadow-sm">
            <select
              name="coinId"
              value={exchange}
              onChange={(e) => setExchange(e.target.value)}
              className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded sm:text-sm border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
            >
              {props.availableExchanges.map((exchange) => (
                <option key={exchange._id} _id={exchange.value}>
                  {exchange.label}
                </option>
              ))}
            </select>
          </div>
        </label>
      </div>
    </form>
  );
};

const NewBotModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [availableExchanges, setAvailableExchanges] = useState([]);

  const allExchanges = async () => {
    const response = await cmsClient.get("/available-exchanges");
    setAvailableExchanges(response.data);
  };

  useEffect(() => allExchanges(), []);

  return (
    <>
      {availableExchanges ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full focus:outline-none flex items-center text-gray-200 dark:text-gray-600 dark:border-gray-700 hover:text-gray-900 dark:hover:text-gray-100 transition rounded"
        >
          <PlusCircleIcon className="w-8 h-8 mr-2" />
          Add new bot
        </button>
      ) : (
        <div className="p-1">
          <Loading width={25} height={25} />
        </div>
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

          <div className="inline-block align-middle rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-xl sm:w-full">
            <div className="bg-white dark:bg-gray-900 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div>
                <div className="mt-6">
                  <h3
                    className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100"
                    id="modal-title"
                  >
                    Add new bot
                  </h3>
                  <div className="mt-2">
                    <NewBotForm availableExchanges={availableExchanges} />
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-800 dark:bg-gray-900 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 dark:text-yellow-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </Dialog>
      </div>
    </>
  );
};

export default NewBotModal;
