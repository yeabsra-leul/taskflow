import React from "react";

const LoaderDots = () => {
  return (
    <div className="flex space-x-1 justify-center items-center h-full dark:invert py-4">
      <span className="sr-only">Loading...</span>
      <div className="h-2 w-2 bg-black/60 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="h-2 w-2 bg-black/60 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="h-2 w-2 bg-black/60 rounded-full animate-bounce"></div>
    </div>
  );
};

export default LoaderDots;
