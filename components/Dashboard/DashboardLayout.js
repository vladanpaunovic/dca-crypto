import Menu from "./Menu/Menu";

const DashboardLayout = ({ children }) => {
  return (
    <div>
      <div className="w-full">
        <Menu />
      </div>
      <div className="h-full w-full">{children}</div>
    </div>
  );
};

export default DashboardLayout;
