import { AppProps } from "next/app";
import { Session } from "next-auth";
import { ReactElement } from "react";
import { SessionProvider } from "next-auth/react";
import "tailwindcss/tailwind.css";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps & { pageProps: { session: Session | null } }): ReactElement {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
