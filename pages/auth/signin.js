import { getCsrfToken, getProviders, signIn } from "next-auth/react";
import Logo from "../../components/Logo/Logo";
import Image from "next/image";
import { classNames } from "../../styles/utils";
import { useRouter } from "next/router";

const buttonStyle =
  "p-2 w-full border dark:border-gray-700 rounded-md flex items-center justify-center transition";

function EmailSignIn({ csrfToken, callbackUrl }) {
  return (
    <form
      method="post"
      action={`/api/auth/signin/email?callbackUrl=${callbackUrl}`}
    >
      <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
      <label>
        <span className="font-medium text-gray-600 text-sm dark:text-gray-200">
          Email address
        </span>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="email@website.com"
          className="w-full mt-1 mb-2 focus:ring-indigo-500 focus:border-indigo-500 flex-1 block rounded-md sm:text-sm border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
        />
      </label>
      <button
        type="submit"
        className={classNames(
          buttonStyle,
          "bg-gray-900 text-white hover:bg-gray-700 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-300"
        )}
      >
        Sign in with Email
      </button>
    </form>
  );
}

function GoogleSignIn({ provider, callbackUrl }) {
  return (
    <div key={provider.name}>
      <button
        className={classNames(
          buttonStyle,
          "hover:bg-gray-100 dark:hover:bg-gray-700"
        )}
        onClick={() => signIn(provider.id, { callbackUrl })}
      >
        <div className="relative w-6 h-6 mr-2">
          <Image
            src="/images/google-logo.svg"
            layout="fill"
            alt="Google logo"
          />
        </div>
        Sign in with {provider.name}
      </button>
    </div>
  );
}

export function SignIn({ providers, csrfToken, callbackUrl }) {
  return (
    <div className="p-4 lg:p-16">
      <div className="flex mb-8">
        <Logo />
      </div>
      <h1 className="h1-title mb-16">Sign in</h1>
      <GoogleSignIn provider={providers.google} callbackUrl={callbackUrl} />

      <div className="py-4">
        <div className="grid grid-cols-3 items-center mt-6">
          <div>
            <hr className="dark:border-gray-600" />
          </div>
          <div className=" text-gray-500 text-center text-sm">
            Or continue with
          </div>
          <div>
            <hr className="dark:border-gray-600" />
          </div>
        </div>
      </div>
      <EmailSignIn csrfToken={csrfToken} callbackUrl={callbackUrl} />
    </div>
  );
}

export default function SignInPage(props) {
  const router = useRouter();

  const callbackUrl = router.query.callbackUrl;

  return (
    <div className="grid md:grid-cols-3 h-screen">
      <div>
        <SignIn {...props} callbackUrl={callbackUrl} />
      </div>
      <div className="col-span-2 hidden md:block relative">
        <Image
          src="/images/sign-in-background.jpg"
          layout="fill"
          alt="sign in background"
        />
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const csrfToken = await getCsrfToken(context);
  const providers = await getProviders();

  return {
    props: { providers, csrfToken },
  };
}
