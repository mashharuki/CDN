"use client";

import { useEffect, useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import BuyDomainModal from "~~/components/BuyDomainModal";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { getBlockExplorerTokenLink } from "~~/utils/scaffold-eth";

type MarketCardPorps = {
  nftMarketContractData?: any;
  deployedContractData?: any;
  listing: any;
};

/**
 * MarketCard Components
 * @returns
 */
export const MarketCard = (porps: MarketCardPorps) => {
  const [isOpen, setIsOpen] = useState(false);

  const { address } = useAccount();
  const { targetNetwork } = useTargetNetwork();

  // get tokenUri
  const { data: listing, refetch: getListing } = useReadContract({
    address: porps.nftMarketContractData.address,
    functionName: "getListing",
    abi: porps.nftMarketContractData.abi,
    args: [porps.listing[0]],
    chainId: targetNetwork.id,
    query: {
      enabled: false,
      retry: false,
    },
  });

  useEffect(() => {
    /**
     * 初期化メソッド
     */
    const init = async () => {
      await getListing();
      console.log("address", address);
      console.log("listing", listing);
    };
    init();
  }, []);

  return (
    <>
      <BuyDomainModal
        open={isOpen}
        onCancel={() => setIsOpen(false)}
        onOk={() => setIsOpen(false)}
        deployedContractData={porps.deployedContractData}
        nftMarketContractData={porps.nftMarketContractData}
        listing={porps.listing}
      />
      <div>
        <div className="card w-96 text-primary-content m-2 bg-gradient-to-r from-blue-500 via-orange-500 to-pink-500 text-white p-5 rounded-lg shadow-lg transition-transform transform hover:scale-105">
          <div className="card-body">
            {name != undefined && <h2 className="card-title">{name as any}.xcr</h2>}
            <h5>
              ID:{" "}
              <a
                className="underline"
                target="_blank"
                href={getBlockExplorerTokenLink(targetNetwork, porps.deployedContractData.address, porps.listing[0])}
              >
                {porps.listing[0]}
              </a>
            </h5>
            <button
              onClick={() => setIsOpen(true)}
              className="absolute bottom-4 right-3 bg-white text-blue-500 rounded-full p-2 shadow-lg hover:bg-gray-200 transition-colors"
            >
              <ShoppingCartIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
