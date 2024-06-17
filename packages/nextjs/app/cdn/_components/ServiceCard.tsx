"use client";

import { useState } from "react";
import { Contract, ethers } from "ethers";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { formatEther } from "viem";
import { useAccount, useReadContract, useSignTypedData, useWriteContract } from "wagmi";
import Loading from "~~/components/Loading";
import { useEthersSigner } from "~~/hooks/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { ForwardRequest } from "~~/utils/types";

type ContractUIProps = {
  deployedContractData?: any;
  SampleForwarderContractData?: any;
};

/**
 * ServiceCard Components
 * @returns
 */
export const ServiceCard = ({ deployedContractData, SampleForwarderContractData }: ContractUIProps) => {
  const [domain, setDomain] = useState<string>();
  const [price, setPrice] = useState<any>();
  const { targetNetwork } = useTargetNetwork();
  const { signTypedDataAsync } = useSignTypedData();
  const { address } = useAccount();

  const { isPending } = useWriteContract();
  // get signer object
  const signer = useEthersSigner({ chainId: targetNetwork.id });

  // get checkRegistered function
  const { data, refetch } = useReadContract({
    address: deployedContractData.address,
    functionName: "checkRegistered",
    abi: deployedContractData.abi,
    args: [domain as any],
    chainId: targetNetwork.id,
  });
  // get price function
  const { data: domainPrice, refetch: getPrice } = useReadContract({
    address: deployedContractData.address,
    functionName: "price",
    abi: deployedContractData.abi,
    args: [domain as any],
    chainId: targetNetwork.id,
    query: {
      enabled: true,
      retry: true,
    },
  });
  // get signer's nonce
  const { data: nonce, refetch: getNonce } = useReadContract({
    address: SampleForwarderContractData.address,
    functionName: "getNonce",
    abi: SampleForwarderContractData.abi,
    args: [address as any],
    chainId: targetNetwork.id,
    query: {
      enabled: true,
      retry: true,
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
      // get nonce
      await getNonce();
      console.log("nonce:", nonce);
      console.log("price:", price);

      // create Contract object
      const domains: any = new Contract(deployedContractData.address, deployedContractData.abi, signer) as any;
      const forwarder: any = new Contract(
        SampleForwarderContractData.address,
        SampleForwarderContractData.abi,
        signer,
      ) as any;
      // get domain
      const domainData = await forwarder.eip712Domain();
      console.log("domain:", domainData);
      // generate encoded data
      const data = domains.interface.encodeFunctionData("register", [domain]);
      // genearte signature
      const signature = await signTypedDataAsync({
        domain: {
          name: domainData[1],
          version: domainData[2],
          chainId: domainData[3],
          verifyingContract: domainData[4] as any,
        },
        types: {
          ForwardRequest: ForwardRequest,
        },
        primaryType: "ForwardRequest",
        message: {
          from: address,
          to: deployedContractData.address,
          value: ethers.parseEther(price.toString()),
          gas: 360000,
          nonce: nonce,
          data: data,
        },
      });

      // request forward request
      await fetch("/api/requestRelayer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: address?.toString(),
          to: deployedContractData.address.toString(),
          value: ethers.parseEther(price.toString()).toString(),
          gas: 360000n,
          nonce: nonce,
          data: data.toString(),
          signature: signature.toString(),
        }),
      }).then(async (result: any) => {
        console.log("gasless result:", await result.json());
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
