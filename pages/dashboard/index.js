import { signIn, useSession } from "next-auth/client";
import Dashboard from "../../components/Dashboard/Dashboard";
import { DashboardContextProvider } from "../../components/DashboardContext/DashboardContext";

export default function Page() {
  const [session] = useSession();

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
