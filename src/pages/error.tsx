import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useState } from "react";

const ErrorPage = () => {
  const router = useRouter();
  const { error } = router.query;
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    switch (error) {
      case "Configuration":
        setErrorMessage(
          "There is a problem with the server configuration. Check if your options are correct."
        );
        break;
      case "AccessDenied":
        setErrorMessage(
          "Access is denied. You may have restricted access through the signIn callback, or redirect callback."
        );
        break;
      case "Verification":
        setErrorMessage(
          "you already used your email sign in link. Please request a new one by signing in again."
        );
        break;
      default:
        setErrorMessage("An unknown error occurred.");
        break;
    }
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center lowercase">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Error.</h1>
        <p className="text-gray-700 mb-4">{errorMessage}</p>
        <Link href="/login" className="text-blue-500">
          Go back to Sign In
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
