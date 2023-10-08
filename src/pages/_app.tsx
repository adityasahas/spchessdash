import { AppProps } from "next/app";
import { Session } from "next-auth";
import { ReactElement } from "react";
import { SessionProvider } from "next-auth/react";
import "tailwindcss/tailwind.css";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider } from "next-themes";
import "../styles/globals.css";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps & { pageProps: { session: Session | null } }): ReactElement {
  return (
    <NextUIProvider>
      <ThemeProvider attribute="class" defaultTheme="light">
        <SessionProvider session={session}>
          <div className=" font-custom">
            <Component {...pageProps} />{" "}
          </div>
        </SessionProvider>
      </ThemeProvider>
    </NextUIProvider>
  );
}
