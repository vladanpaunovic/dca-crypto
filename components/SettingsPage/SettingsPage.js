import DashboardTitle from "../Dashboard/DashboardTitle";
import DashboardMenu from "../Dashboard/Menu/DashboardMenu";
import CoinbaseCommerceButton from "react-coinbase-commerce";
import "react-coinbase-commerce/dist/coinbase-commerce-button.css";
import { useSession } from "next-auth/client";

const Subscription = () => {
  const [session] = useSession();
  const annualSubscriptinCheckoutId = "aff64dae-afae-4305-ae75-e3e23b54a31d";
  return (
    <div>
      <span className="p-2 rounded bg-indigo-500 text-white flex">
        <CoinbaseCommerceButton
          checkoutId={annualSubscriptinCheckoutId}
          onChargeSuccess={(data) => console.log("SUCCESS", data)}
          onChargeFailure={(data) => console.log("FAILURE", data)}
          onPaymentDetected={(data) => console.log("PAYMENT_DETECTED", data)}
          onModalClosed={() => console.log("MODAL_CLOSED")}
          customMetadata={JSON.stringify({ userId: session.user.id })}
        />
      </span>
    </div>
  );
};

const Settings = () => {
  return (
    <div className="lg:flex">
      <div className="w-12/12 lg:w-16 bg-gray-900 dark:bg-gray-900 border-r border-gray-800">
        <DashboardMenu />
      </div>
      <div className="w-12/12 flex-1 bg-gray-100 dark:bg-gray-800 h-screen ">
        <DashboardTitle title="Settings" />
        <div className="p-8 flex">
          <div className="grid-cols-3 gap-8">
            <div>
              <Subscription />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
