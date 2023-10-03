import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "../../../utils/mongodb";

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
  ],
  pages: {
    error: "/access-denied",
  },
};

export default NextAuth(authOptions);
