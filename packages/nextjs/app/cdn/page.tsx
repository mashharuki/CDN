import type { NextPage } from "next";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "Debug Contracts",
  description: "Debug your deployed 🏗 Scaffold-ETH 2 contracts in an easy way",
});

/**
 * Domain Name Service Page
 * @returns 
 */
const Cdn: NextPage = () => {
  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-4xl font-bold">
              CrossValueChain Domain Name Service Page
            </span>
          </h1>
        </div>
      </div>
    </>
  );
};

export default Cdn;
