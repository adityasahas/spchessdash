// src/components/LoadingComponent.tsx
import React from "react";
import { Spinner } from "@nextui-org/react";

const LoadingComponent: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Spinner size="lg" color="primary" />
      <p className="mt-4 text-gray-600">Loading content...</p>
    </div>
  );
};

export default LoadingComponent;
