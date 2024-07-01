"use client";

import { MarketCards } from "./_components/MarketCards";
import type { NextPage } from "next";
import Toaster from "~~/components/Toaster";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";
import { ContractName } from "~~/utils/scaffold-eth/contract";
import { getAllContracts } from "~~/utils/scaffold-eth/contractsData";

/**
 * Domain MarketPlace Page
 * @returns
 */
const Market: NextPage = () => {
  const contractsData = getAllContracts();
  const contractNames = Object.keys(contractsData) as ContractName[];

  const { data: nftMarketContractData } = useDeployedContractInfo(contractNames[1]);
  const { data: deployedContractData } = useDeployedContractInfo(contractNames[0]);

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10 w-full">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-4xl font-bold">Domain MarketPlace Page</span>
          </h1>
          {nftMarketContractData != undefined && (
            <MarketCards nftMarketContractData={nftMarketContractData} deployedContractData={deployedContractData} />
          )}
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default Market;
