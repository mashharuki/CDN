"use client";

import { useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { useReadContract } from "wagmi";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { getBlockExplorerAddressLink } from "~~/utils/scaffold-eth";

type DomainCardPorps = {
  id: number;
  name: string;
  deployedContractData?: any;
};

/**
 * DomainCard Components
 * @returns
 */
export const DomainCard = (porps: DomainCardPorps) => {
  const { targetNetwork } = useTargetNetwork();

  console.log("name:", porps.name);

  // get data
  const { data: record, refetch: getRecord } = useReadContract({
    address: porps.deployedContractData.address,
    functionName: "records",
    abi: porps.deployedContractData.abi,
    args: [porps.name],
    chainId: targetNetwork.id,
    query: {
      enabled: false,
      retry: true,
    },
  });

  const { data: owner, refetch: getOwner } = useReadContract({
    address: porps.deployedContractData.address,
    functionName: "domains",
    abi: porps.deployedContractData.abi,
    args: [porps.name],
    chainId: targetNetwork.id,
    query: {
      enabled: false,
      retry: true,
    },
  });

  /**
   * format address
   */
  function formatDisplayAddress(str: string): string {
    if (str.length < 6) return "Invalid string";
    const firstThree = str.slice(2, 5);
    const lastThree = str.slice(-3);
    return firstThree + "..." + lastThree;
  }

  useEffect(() => {
    const init = async () => {
      await getRecord();
      await getOwner();
      console.log("owner:", owner);
      console.log("record:", record);
    };
    init();
  }, []);

  return (
    <>
      {record != undefined && owner != undefined && (
        <div className="card w-96 bg-primary text-primary-content m-2">
          <div className="card-body">
            <h2 className="card-title">{porps.name}</h2>
            <h5 className="">ID: {porps.id}</h5>
            <p>
              <a target="_blank" href={getBlockExplorerAddressLink(targetNetwork, owner as any)}>
                owner: {formatDisplayAddress(owner as any)}
              </a>
            </p>
            <p>
              <a target="_blank" href={record as any}>
                record: {record as any}
              </a>
            </p>
          </div>
        </div>
      )}
    </>
  );
};
