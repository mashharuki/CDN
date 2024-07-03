"use client";

import { useEffect } from "react";
import { MarketCard } from "./MarketCard";
import "react-toastify/dist/ReactToastify.css";
import { useReadContract } from "wagmi";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";

type ContractUIProps = {
  nftMarketContractData?: any;
  deployedContractData?: any;
};

/**
 * MarketCards Components
 * @returns
 */
export const MarketCards = ({ nftMarketContractData, deployedContractData }: ContractUIProps) => {
  const { targetNetwork } = useTargetNetwork();

  const { data: listings, refetch } = useReadContract({
    address: nftMarketContractData.address,
    functionName: "getAllListings",
    abi: nftMarketContractData.abi,
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
  const displayCards = (listings: any) => {
    return (
      <div className="flex flex-wrap m-auto">
        {listings.map((listing: any, index: number) => {
          return (
            <div className="" key={index}>
              <MarketCard
                nftMarketContractData={nftMarketContractData}
                deployedContractData={deployedContractData}
                listing={listing}
              />
            </div>
          );
        })}
      </div>
    );
  };

  useEffect(() => {
    const init = async () => {
      await refetch();
      console.log("listings", listings);
    };
    init();
  }, []);

  return <div>{listings != undefined && <>{displayCards(listings)}</>}</div>;
};
