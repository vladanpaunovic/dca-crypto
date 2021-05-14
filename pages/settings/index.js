import { signIn, useSession } from "next-auth/client";
import { DashboardContextProvider } from "../../components/DashboardContext/DashboardContext";
import Settings from "../../components/SettingsPage/SettingsPage";

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
          <Settings />
        </DashboardContextProvider>
      )}
    </>
  );
}
