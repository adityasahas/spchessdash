import React from "react";
import { useSession } from "next-auth/react";
import { Spinner } from "@nextui-org/react";
import { Layout } from "../components/layout/layout";

const LoadingComponent: React.FC = () => {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const content = (
    <div className="flex flex-col items-center justify-center min-h-screen mx-auto">
      <Spinner size="lg" color="primary" />
      <p className="mt-4 text-gray-600">Loading content...</p>
      <p className="mt-4 text-gray-600">
        this websites a work in progress. sorry for any issues
      </p>
    </div>
  );

  if (loading) {
    return content;
  }

  if (session) {
    return <Layout>{content}</Layout>;
  }

  return content;
};

export default LoadingComponent;
