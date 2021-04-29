import Menu from "./Menu/Menu";

const Dashboard = () => {
  return (
    <div className="flex h-full">
      <div className="h-screen border-r dark:border-gray-700 shadow">
        <Menu />
      </div>
      <div className="h-screen w-full p-4">content</div>
    </div>
  );
};

export default Dashboard;
