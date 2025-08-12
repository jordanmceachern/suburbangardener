import React from "react";

export const Greeting = () => (
  <div className="rounded-lg p-6 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex flex-col items-start sm:items-center py-3 w-full">
    <h1 className="text-4xl font-bold text-neutral-700 dark:text-neutral-300">
      Welcome to Suburban Gardener
    </h1>
    <p className="text-lg text-neutral-700 dark:text-neutral-300 mt-1">
      Begin your backyard gardening journey today!
    </p>
  </div>
);

export default Greeting;
