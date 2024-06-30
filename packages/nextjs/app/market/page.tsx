"use client";

import type { NextPage } from "next";
import Toaster from "~~/components/Toaster";

/**
 * Domain MarketPlace Page
 * @returns
 */
const Market: NextPage = () => {
  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10 w-full">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-4xl font-bold">Domain MarketPlace Page</span>
          </h1>
          test
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default Market;
