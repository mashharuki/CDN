"use client";

import { DomainCards } from "./_components/DomainCards";
import type { NextPage } from "next";
import Toaster from "~~/components/Toaster";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";
import { ContractName } from "~~/utils/scaffold-eth/contract";
import { getAllContracts } from "~~/utils/scaffold-eth/contractsData";

/**
 * Domains pages
 * @returns
 */
const Domains: NextPage = () => {
  const contractsData = getAllContracts();
  const contractNames = Object.keys(contractsData) as ContractName[];

  const { data: deployedContractData } = useDeployedContractInfo(contractNames[0]);

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-4xl font-bold">Minted Domains</span>
          </h1>
          {deployedContractData != undefined && <DomainCards deployedContractData={deployedContractData} />}
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default Domains;
