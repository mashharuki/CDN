"use client";

import { useEffect } from "react";
import { DomainCard } from "./DomainCard";
import "react-toastify/dist/ReactToastify.css";
import { useReadContract } from "wagmi";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";

type ContractUIProps = {
  deployedContractData?: any;
};

/**
 * DomainCards Components
 * @returns
 */
export const DomainCards = ({ deployedContractData }: ContractUIProps) => {
  const { targetNetwork } = useTargetNetwork();

  const { data: names, refetch } = useReadContract({
    address: deployedContractData.address,
    functionName: "getAllNames",
    abi: deployedContractData.abi,
    args: [],
    chainId: targetNetwork.id,
    query: {
      enabled: false,
      retry: false,
    },
  });

  /**
   * display cards
   */
  const displayCards = (names: any) => {
    return (
      <div>
        {names.map((name: any, index: number) => {
          return (
            <div className="w-1/3" key={index}>
              <DomainCard id={index} name={name} deployedContractData={deployedContractData} />
            </div>
          );
        })}
      </div>
    );
  };

  useEffect(() => {
    const init = async () => {
      await refetch();
    };
    init();
  }, []);

  return (
    <div className="flex flex-wrap">
      <>{names != undefined && <>{displayCards(names)}</>}</>
    </div>
  );
};
