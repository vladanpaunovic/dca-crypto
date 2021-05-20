import { signIn, useSession } from "next-auth/client";
import Dashboard from "../../components/Dashboard/Dashboard";
import { DashboardContextProvider } from "../../components/DashboardContext/DashboardContext";
import Loading from "../../components/Loading/Loading";

export default function Page() {
  const [session, isLoading] = useSession();

  if (isLoading) {
    return (
      <div className="h-screen">
        <Loading withWrapper width={30} height={30} />
      </div>
    );
  }

  return (
    <>
      {!session && (
        <>
          Not signed in <br />
          <button onClick={() => signIn()}>Sign in</button>
        </>
      )}
      {session && (
        <>
          <DashboardContextProvider>
            <Dashboard />
          </DashboardContextProvider>
        </>
      )}
    </>
  );
}
