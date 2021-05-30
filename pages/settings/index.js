import { getSession, signIn, useSession } from "next-auth/client";
import { DashboardContextProvider } from "../../components/DashboardContext/DashboardContext";
import Loading from "../../components/Loading/Loading";
import Settings from "../../components/SettingsPage/SettingsPage";

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
        <DashboardContextProvider>
          <Settings />
        </DashboardContextProvider>
      )}
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    context.res.statusCode = 302;
    context.res.setHeader("Location", `/auth/signin?callbackUrl=/settings`);
  }
  return { props: {} };
}
