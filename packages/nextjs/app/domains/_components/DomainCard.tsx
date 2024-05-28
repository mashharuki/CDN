"use client";

import { useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { useAccount, useReadContract } from "wagmi";
import { PencilIcon } from "@heroicons/react/24/outline";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { getBlockExplorerAddressLink, getBlockExplorerTokenLink } from "~~/utils/scaffold-eth";

type DomainCardPorps = {
  id: number;
  name: string;
  deployedContractData?: any;
  filter: string;
};

/**
 * DomainCard Components
 * @returns
 */
export const DomainCard = (porps: DomainCardPorps) => {
  const { targetNetwork } = useTargetNetwork();
  const { address } = useAccount();

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

  const { data: tokenUri, refetch: getTokenUri } = useReadContract({
    address: porps.deployedContractData.address,
    functionName: "tokenURI",
    abi: porps.deployedContractData.abi,
    args: [porps.id],
    chainId: targetNetwork.id,
    query: {
      enabled: false,
      retry: false,
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
      await getTokenUri();
      console.log("owner:", owner);
      console.log("record:", record);
      console.log("tokenUri:", tokenUri);
    };
    init();
  }, []);

  if (porps.filter == "myDomains") {
    return (
      <>
        {record != undefined && owner != undefined && owner == address && (
          <div className="card w-96 text-primary-content m-2 bg-gradient-to-r from-blue-500 via-orange-500 to-pink-500 text-white p-5 rounded-lg shadow-lg transition-transform transform hover:scale-105">
            <div className="card-body">
              <h2 className="card-title">{porps.name}.xcr</h2>
              <h5 className="underline">
                <a
                  target="_blank"
                  href={getBlockExplorerTokenLink(targetNetwork, porps.deployedContractData.address, porps.id)}
                >
                  ID: {porps.id}
                </a>
              </h5>
              <p className="underline">
                <a target="_blank" href={getBlockExplorerAddressLink(targetNetwork, owner as any)}>
                  owner: {formatDisplayAddress(owner as any)}
                </a>
              </p>
              <p className="underline">
                <a target="_blank" href={record as any}>
                  record: {record as any}
                </a>
              </p>
            </div>
            <button className="absolute bottom-4 right-4 bg-white text-blue-500 rounded-full p-2 shadow-lg hover:bg-gray-200 transition-colors">
              <PencilIcon className="h-5 w-5" />
            </button>
          </div>
        )}
      </>
    );
  } else {
    return (
      <>
        {record != undefined && owner != undefined && (
          <div className="card w-96 text-primary-content m-2 bg-gradient-to-r from-blue-500 via-orange-500 to-pink-500 text-white p-5 rounded-lg shadow-lg transition-transform transform hover:scale-105">
            <div className="card-body">
              <h2 className="card-title">{porps.name}.xcr</h2>
              <h5 className="underline">
                <a
                  target="_blank"
                  href={getBlockExplorerTokenLink(targetNetwork, porps.deployedContractData.address, porps.id)}
                >
                  ID: {porps.id}
                </a>
              </h5>
              <p className="underline">
                <a target="_blank" href={getBlockExplorerAddressLink(targetNetwork, owner as any)}>
                  owner: {formatDisplayAddress(owner as any)}
                </a>
              </p>
              <p className="underline">
                <a target="_blank" href={record as any}>
                  record: {record as any}
                </a>
              </p>
            </div>
            <button className="absolute bottom-4 right-4 bg-white text-blue-500 rounded-full p-2 shadow-lg hover:bg-gray-200 transition-colors">
              <PencilIcon className="h-5 w-5" />
            </button>
          </div>
        )}
      </>
    );
  }
};
