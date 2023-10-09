import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "../../../utils/mongodb";
import EmailProvider from "next-auth/providers/email";

// Ensure env vars are set
if (
  !process.env.GITHUB_ID ||
  !process.env.GITHUB_SECRET ||
  !process.env.GOOGLE_CLIENT_ID ||
  !process.env.GOOGLE_CLIENT_SECRET
) {
  throw new Error("The GitHub and Google OAuth credentials are not set.");
}

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  MongoDBAdapterOptions: {
    collections: "users",
    dataBaseName: "auth",
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    EmailProvider({
      server: {
        host: "smtp.gmail.com",
        port: 587,
        auth: {
          user: "contact@adityasahas.tech",
          pass: process.env.NEXT_PUBLIC_PASSWORD,
        },
      },
      from: "contact@adityasahas.tech",
    }),
  ],
  pages: {
    verifyRequest: "/verify-request",
    error: "/error"
  },
};

export default NextAuth(authOptions);
