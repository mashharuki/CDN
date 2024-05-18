"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { formatEther } from "viem";
import { useReadContract, useWriteContract } from "wagmi";
import Loading from "~~/components/Loading";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";

type ContractUIProps = {
  deployedContractData?: any;
};

/**
 * ServiceCard Components
 * @returns
 */
export const ServiceCard = ({ deployedContractData }: ContractUIProps) => {
  const [domain, setDomain] = useState<string>();
  const [price, setPrice] = useState<any>();
  const { targetNetwork } = useTargetNetwork();

  console.log(deployedContractData);

  const { isPending, writeContractAsync } = useWriteContract();
  const { data, refetch } = useReadContract({
    address: deployedContractData.address,
    functionName: "checkRegistered",
    abi: deployedContractData.abi,
    args: [domain as any],
    chainId: targetNetwork.id,
    query: {
      enabled: false,
      retry: false,
    },
  });

  const { data: domainPrice, refetch: getPrice } = useReadContract({
    address: deployedContractData.address,
    functionName: "price",
    abi: deployedContractData.abi,
    args: [domain as any],
    chainId: targetNetwork.id,
    query: {
      enabled: false,
      retry: false,
    },
  });

  /**
   * checkRegistered
   */
  const checkRegistered = async () => {
    await refetch();
    console.log("data:", data);
    await getPrice();
    console.log("price:", domainPrice);
    setPrice(domainPrice as any);
    if (data) {
      toast.info(`This domain isn't available`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } else {
      toast.info(`This domain is available`, {
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
   * register
   */
  const register = async () => {
    try {
      // register domain
      await writeContractAsync({
        address: deployedContractData.address,
        functionName: "register",
        abi: deployedContractData.abi,
        args: [domain as any],
        chainId: targetNetwork.id,
        value: BigInt(Number(price)),
      });
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

  return (
    <>
      {isPending ? (
        <Loading />
      ) : (
        <>
          <div className="relative items-center w-full px-5 py-12 mx-auto md:px-12 lg:px-24 max-w-7xl">
            <div className="grid grid-cols-1">
              <div className="w-full max-w-7xl mx-auto my-4 bg-white shadow-xl rounded-xl">
                <div className="p-6 lg:text-center">
                  <h4 className="mt-8 text-2xl font-semibold leading-none tracking-tighter text-neutral-600 lg:text-3xl">
                    Register Your domain
                  </h4>
                  <div className="mt-6 join">
                    <input
                      className="input input-bordered join-item"
                      placeholder="Enter Domain"
                      onChange={(e: any) => setDomain(e.target.value)}
                      value={domain}
                    />
                    <button className="btn join-item rounded-r-full" onClick={checkRegistered}>
                      Check
                    </button>
                  </div>
                  {price != undefined && (
                    <>
                      <div className="mt-6 font-semibold leading-none tracking-tighter text-neutral-600">
                        Domain price: {formatEther(price)} XCR
                      </div>
                      <div className="mt-6">
                        <button
                          className="flex items-center justify-center w-full px-10 py-4 text-base font-medium text-center text-white transition duration-400 ease-in-out transform bg-blue-600 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          onClick={register}
                        >
                          Register Your Domain
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
