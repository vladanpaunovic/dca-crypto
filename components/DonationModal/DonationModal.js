import { useState } from "react";
import { Dialog } from "@headlessui/react";
import DonationAsset from "../DonationAsset/DonationAsset";

const donationAssets = [
  {
    symbol: "btc",
    walletAddress: "3E5K5Cem3B2A67pFVpj4r427XWrKyRYyZh",
    qrCode: "/qr-codes-crypto-wallets/btc_address.png",
  },
  {
    symbol: "eth",
    walletAddress: "0x1F7ceeB6dc181cACF895E8c893796C5b2ca3D639",
    qrCode: "/qr-codes-crypto-wallets/eth_address.png",
  },
  {
    symbol: "ada",
    walletAddress:
      "Ae2tdPwUPEYyPZzavAuUSpJ5mbfR9wEzp9SSA48wAshYMAWJHWQ66Ug5sm7",
    qrCode: "/qr-codes-crypto-wallets/ada_address.png",
  },
];

function DonationModal() {
  let [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-indigo-500 text-white rounded mr-2"
      >
        Donate
      </button>
      <div className="relative">
        <Dialog
          open={isOpen}
          onClose={() => setIsOpen(false)}
          className="fixed z-10 inset-0 overflow-y-auto text-center"
        >
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-90 " />
          <span
            class="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <div class="inline-block align-middle rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-xl sm:w-full">
            <div class="bg-white dark:bg-gray-900 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div>
                <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-50 dark:bg-green-300">
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
                <div class="mt-6 text-center">
                  <h3
                    class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100"
                    id="modal-title"
                  >
                    Thank you!
                  </h3>
                  <div class="mt-2">
                    <p class="text-sm text-gray-400 ">
                      Your donation woll help improve this product
                    </p>
                    <div className="mt-4">
                      {donationAssets.map((asset) => (
                        <DonationAsset key={asset.symbol} {...asset} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Dialog>
      </div>
    </>
  );
}

export default DonationModal;
