import DashboardMenu from "./Menu/DashboardMenu";

const DashboardLayout = ({ children }) => {
  return (
    <div className="">
      <div className="w-full ">{/* <DashboardMenu /> */}</div>
      <div className="h-full w-full">{children}</div>
    </div>
  );
};

export default DashboardLayout;
