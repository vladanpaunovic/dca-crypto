import { useState, useRef } from "react";
import { Dialog } from "@headlessui/react";
import DonationAsset from "../DonationAsset/DonationAsset";
import { donationAssets } from "../../config";
import { HeartIcon } from "@heroicons/react/outline";

function DonationModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const buttonRef = useRef();

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        onMouseOver={() => setIsHover(true)}
        onMouseOut={() => setIsHover(false)}
        className="flex items-center sm:px-4 sm:py-2 sm:bg-gradient-to-r sm:from-indigo-400 sm:to-indigo-800 sm:text-white rounded"
      >
        <span className="hidden sm:block">Donate</span>
        <HeartIcon
          fill={isHover ? "currentColor" : "none"}
          className="h-5 w-5 ml-1"
        />
      </button>
      <div className="relative">
        <Dialog
          initialFocus={buttonRef}
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
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-50 dark:bg-green-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div className="mt-6 text-center">
                  <h3
                    className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100"
                    id="modal-title"
                  >
                    Thank you!
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-400 ">
                      Your donation will help improve this product
                    </p>
                    <div className="mt-4">
                      {donationAssets.map((asset) => (
                        <DonationAsset
                          ref={buttonRef}
                          key={asset.coinId}
                          {...asset}
                        />
                      ))}
                    </div>
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
}

export default DonationModal;
