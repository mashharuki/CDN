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

  const { isPending, writeContractAsync } = useWriteContract();
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
      console.log("address:", address);
      console.log("deployedContractData.address:", deployedContractData.address);
      console.log("nonce:", nonce);
      console.log("price:", price);
      console.log("price:", ethers.formatEther(price.toString()));

      // create Contract object
      const domains: any = new Contract(deployedContractData.address, deployedContractData.abi, signer) as any;
      const forwarder: any = new Contract(
        SampleForwarderContractData.address,
        SampleForwarderContractData.abi,
        signer,
      ) as any;
      // get domain
      const domainData = await forwarder.eip712Domain();
      // generate encoded data
      const data = domains.interface.encodeFunctionData("register", [domain]);
      // genearte signature
      const signature = await signTypedDataAsync({
        domain: {
          name: domainData.name,
          version: domainData.version,
          chainId: domainData.chainId,
          verifyingContract: domainData.verifyingContract as any,
        },
        types: {
          ForwardRequest: ForwardRequest,
        },
        primaryType: "ForwardRequest",
        message: {
          from: address,
          to: deployedContractData.address,
          value: price,
          gas: 9000000,
          nonce: nonce,
          data: data,
        },
      });
      console.log("signature:", signature);
      // 事前に署名データを検証
      const result = await forwarder.verify(
        {
          from: address,
          to: deployedContractData.address,
          value: price,
          gas: 9000000,
          nonce: nonce,
          data: data,
        },
        signature,
      );
      console.log("verify result: ", result);

      // register domain
      await writeContractAsync({
        address: deployedContractData.address,
        functionName: "register",
        abi: deployedContractData.abi,
        args: [domain as any],
        chainId: targetNetwork.id,
        value: BigInt(Number(price)),

        /*
        // request forward request
      await fetch("/api/requestRelayer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: address,
          to: deployedContractData.address,
          value: price,
          gas: 400000,
          nonce: (nonce as any).toString(),
          data: data,
          signature: signature,
        }),
        */
      }).then(async () => {
        // console.log("gasless result:", await result.json());
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
