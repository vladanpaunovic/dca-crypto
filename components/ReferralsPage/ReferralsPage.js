import { useMyReferrals } from "../../queries/queries";
import DashboardTitle from "../Dashboard/DashboardTitle";
import DashboardMenu from "../Dashboard/Menu/DashboardMenu";

const ReferralsPage = () => {
  const myReferrals = useMyReferrals();

  return (
    <div className="lg:flex">
      <div className="w-12/12 lg:w-16 bg-gray-900 dark:bg-gray-900 border-r border-gray-800">
        <DashboardMenu />
      </div>
      <div className="w-12/12 flex-1 bg-gray-100 dark:bg-gray-800 h-screen ">
        <DashboardTitle title="Referrals" />
        <div className="p-8 flex">
          <div className="grid lg:grid-cols-2 gap-8 w-full">
            <div>1</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralsPage;
