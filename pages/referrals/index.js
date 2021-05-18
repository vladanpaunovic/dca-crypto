import { signIn, useSession } from "next-auth/client";
import { DashboardContextProvider } from "../../components/DashboardContext/DashboardContext";
import ReferralsPage from "../../components/ReferralsPage/ReferralsPage";

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
          <ReferralsPage />
        </DashboardContextProvider>
      )}
    </>
  );
}
