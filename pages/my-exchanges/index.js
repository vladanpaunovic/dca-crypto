import { signIn, useSession } from "next-auth/client";
import MyExchanges from "../../components/Dashboard/MyExchanges";
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
        <DashboardContextProvider>
          <MyExchanges />
        </DashboardContextProvider>
      )}
    </>
  );
}
