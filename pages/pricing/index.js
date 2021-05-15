import { signIn, useSession } from "next-auth/client";
import { DashboardContextProvider } from "../../components/DashboardContext/DashboardContext";
import PricingPage from "../../components/PricingPage/PricingPage";

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
          <PricingPage />
        </DashboardContextProvider>
      )}
    </>
  );
}
