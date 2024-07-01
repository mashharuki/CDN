import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useReadContract, useWriteContract } from "wagmi";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";

export type ModalProps = {
  open: boolean;
  onCancel: () => void;
  onOk: () => void;
  nftMarketContractData?: any;
  deployedContractData?: any;
  listing: any;
};

/**
 * BuyDomainModal Component
 * @param porps
 * @returns
 */
const BuyDomainModal = (porps: ModalProps) => {
  const [price, setPrice] = useState<any>();
  const [years, setYears] = useState(1);

  const { targetNetwork } = useTargetNetwork();

  const { writeContractAsync } = useWriteContract();

  // get domain name
  const { data: name, refetch: getName } = useReadContract({
    address: porps.nftMarketContractData.address,
    functionName: "names",
    abi: porps.nftMarketContractData.abi,
    args: [porps.listing[0]],
    chainId: targetNetwork.id,
    query: {
      enabled: false,
      retry: false,
    },
  });

  // get price function
  const { data: domainPrice, refetch: getPrice } = useReadContract({
    address: porps.deployedContractData.address,
    functionName: "price",
    abi: porps.deployedContractData.abi,
    args: [name as any, years],
    chainId: targetNetwork.id,
    query: {
      enabled: true,
      retry: true,
    },
  });

  /**
   * buy domain
   */
  const buyDomain = async () => {
    try {
      // register domain
      await writeContractAsync({
        address: porps.nftMarketContractData.address,
        functionName: "buyItem",
        abi: porps.nftMarketContractData.abi,
        args: [porps.listing[0], name, years],
        chainId: targetNetwork.id,
        value: BigInt(Number(price)),
      }).then(async () => {
        toast.success("🦄 Success!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      });
    } catch (err: any) {
      console.error("err:", err);
      toast.error("Failed....", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  /**
   * 有効期限を1年増やす
   */
  const increaseYears = async () => {
    if (years < 5) {
      setYears(years + 1);
    }
  };

  /**
   * 有効期限を1年減らす
   */
  const decreaseYears = async () => {
    if (years > 1) {
      setYears(years - 1);
    }
  };

  useEffect(() => {
    /**
     * 初期化メソッド
     */
    const init = async () => {
      await getName();
      console.log("domain name:", name);
    };
    init();
  }, []);

  useEffect(() => {
    const updatePrice = async () => {
      await getPrice();
      console.log("price:", domainPrice);
      setPrice(domainPrice);
    };
    updatePrice();
  }, [years]);

  return porps.open ? (
    <>
      <div className="bg-white rounded-lg shadow-lg transform -translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 w-96 p-8 flex flex-col items-center z-20">
        <h1 className="text-2xl font-bold text-gray-700 mb-4">Buy Domain</h1>
        <p className="text-lg text-gray-600 mb-6">Select years</p>
        <div className="flex items-center justify-center mt-5">
          <button className="btn" onClick={decreaseYears} disabled={years <= 1}>
            -
          </button>
          <span className="mx-4 text-black">
            {years} Year{years > 1 ? "s" : ""}
          </span>
          <button className="btn" onClick={increaseYears} disabled={years >= 5}>
            +
          </button>
        </div>
        <button
          className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-6 py-2 transition duration-300 ease-in-out"
          onClick={async () => {
            buyDomain();
          }}
        >
          Buy
        </button>
      </div>
      <div className="fixed inset-0 bg-black bg-opacity-50 w-full h-full z-10" onClick={() => porps.onCancel()}></div>
    </>
  ) : (
    <></>
  );
};

export default BuyDomainModal;
