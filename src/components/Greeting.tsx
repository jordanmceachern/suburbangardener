import React from "react";

export const Greeting = () => (
  <div className="rounded-lg p-6 bg-tertiary-100 dark:bg-tertiary-800 border border-tertiary-200 dark:border-tertiary-700 flex flex-col items-start sm:items-center py-3 w-full">
    <h1 className="text-2xl sm:text-4xl font-bold text-neutral-900 dark:text-neutral-300 text-center">
      Welcome to Suburban Gardener
    </h1>
    <p className="text-start sm:text-center text-lg text-neutral-900 dark:text-neutral-300 mt-1">
      Begin your backyard gardening journey today!
    </p>
  </div>
);

export default Greeting;
