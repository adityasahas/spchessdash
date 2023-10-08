import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

import { getCsrfToken } from "next-auth/react";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getProviders, signIn } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import { useEffect } from "react";
import { useRouter } from "next/router";
export default function SignIn({
  csrfToken,
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-white h-screen">
        <div className="flex flex-col sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            sp chess club dashboard login
          </h2>
          <Link href="/">
            <h4 className="text-center font-bold leading-9 tracking-tight text-gray-900">
              go back to home page <span aria-hidden="true">→</span>
            </h4>
          </Link>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <div>
            <form method="post" action="/api/auth/signin/email">
              <input
                name="csrfToken"
                type="hidden"
                defaultValue={csrfToken || ""}
              />
              <label>
                Name
                <input
                  type="name"
                  id="name"
                  name="name"
                  autoComplete="name"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </label>
              <label>
                Email address
                <input
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </label>

              <button
                className="mt-5 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 lowercase"
                type="submit"
              >
                send login link
              </button>
            </form>
            {Object.values(providers).map((provider, index) => (
              <div key={provider.name}>
                {provider.id !== "email" && (
                  <>
                    {index === 0 && (
                      <div className="my-3 flex justify-center items-center">
                        <div className="border-t w-full border-gray-300" />
                        <span className="text-gray-600 px-3 bg-white">
                          or sign in with
                        </span>
                        <div className="border-t w-full border-gray-300" />
                      </div>
                    )}
                    <button
                      className="mt-5 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 lowercase"
                      onClick={() => signIn(provider.id)}
                    >
                      sign in with {provider.name}
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const providers = await getProviders();
  const csrfToken = await getCsrfToken(context);

  console.log(csrfToken);

  return {
    props: {
      csrfToken: csrfToken ?? null,
      providers: providers ?? [],
    },
  };
}
