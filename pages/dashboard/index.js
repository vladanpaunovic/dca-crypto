import { signIn, useSession } from "next-auth/client";
import Dashboard from "../../components/Dashboard/Dashboard";

export default function Page() {
  const [session, loading] = useSession();

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
          <Dashboard />
        </>
      )}
    </>
  );
}
