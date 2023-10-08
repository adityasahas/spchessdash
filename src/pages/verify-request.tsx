// pages/auth/verify-request.tsx
import React from "react";
import { getProviders } from "next-auth/react";
import Link from "next/link";

const VerifyRequest = ({ providers }) => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8 ">
      <div className="max-w-md w-full space-y-8 p-10 rounded-md shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold ">
            Check your email
          </h2>
          <p className="mt-2 text-center text-sm">
            A sign-in link has been sent to your email address.
          </p>
        </div>
        <div className="mt-6">
          <p className="text-center text-sm">
            If you did not receive the email,{" "}
            <Link
              className="font-medium text-indigo-600 hover:text-indigo-500"
               href="/auth/signin"
            >
              try again
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps(context) {
  const providers = await getProviders();
  return {
    props: { providers },
  };
}

export default VerifyRequest;
