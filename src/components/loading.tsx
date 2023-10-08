// src/components/LoadingComponent.tsx
import React from "react";
import { Spinner } from "@nextui-org/react";

const LoadingComponent: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Spinner size="lg" color="primary" />
      <p className="mt-4 text-gray-600">Loading content...</p>
      <p className="mt-4 text-gray-600">this websites a work in progress, refresh the page for it to load. sorry</p>
    </div>
  );
};

export default LoadingComponent;
