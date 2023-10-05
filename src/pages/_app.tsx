import { AppProps } from "next/app";
import { Session } from "next-auth";
import { ReactElement } from "react";
import { SessionProvider } from "next-auth/react";
import "tailwindcss/tailwind.css";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider } from "next-themes";
export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps & { pageProps: { session: Session | null } }): ReactElement {
  return (
    <NextUIProvider>
      <ThemeProvider attribute="class" defaultTheme="light" >
        <SessionProvider session={session}>
          <Component {...pageProps} />{" "}
        </SessionProvider>
      </ThemeProvider>
    </NextUIProvider>
  );
}
