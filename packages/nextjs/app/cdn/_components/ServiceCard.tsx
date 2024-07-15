"use client";

import { useEffect, useState } from "react";
import { Contract } from "ethers";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { formatEther } from "viem";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { signTypedData } from "wagmi/actions";
import { POST } from "~~/app/api/requestRelayer/route";
import Loading from "~~/components/Loading";
import { useEthersSigner } from "~~/hooks/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { wagmiConfig } from "~~/services/web3/wagmiConfig";
import { getUint48 } from "~~/utils/helper";
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
  const [isAvailable, setIsAvailable] = useState<boolean>(false);
  const [years, setYears] = useState(1);
  const { targetNetwork } = useTargetNetwork();
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
    args: [domain as any, years],
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
    if (data) {
      setIsAvailable(true);
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
      setIsAvailable(false);
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

      // create Contract object
      const domains: any = new Contract(deployedContractData.address, deployedContractData.abi, signer) as any;
      const forwarder: any = new Contract(
        SampleForwarderContractData.address,
        SampleForwarderContractData.abi,
        signer,
      ) as any;
      // generate encoded data
      const data = domains.interface.encodeFunctionData("register", [address, domain, years]);
      // get EIP712 domain
      const eip721Domain = await forwarder.eip712Domain();
      // get deadline
      const uint48Time = await getUint48();
      // creat metaTx request data
      const signature = await signTypedData(wagmiConfig, {
        domain: {
          name: eip721Domain.name,
          version: eip721Domain.version,
          chainId: eip721Domain.chainId,
          verifyingContract: eip721Domain.verifyingContract,
        },
        types: {
          ForwardRequest: ForwardRequest,
        },
        primaryType: "ForwardRequest",
        message: {
          from: address,
          to: domains.target,
          value: price.toString(),
          gas: 9000000n,
          nonce: await forwarder.nonces(address),
          deadline: uint48Time,
          data: data,
        },
      });

      console.log("signature:", signature);

      // call execute method from relayer
      await POST({
        request: {
          from: address,
          to: domains.target,
          value: price.toString(),
          gas: 9000000n,
          deadline: uint48Time,
          data: data,
          signature: signature,
        },
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
    const updatePrice = async () => {
      await getPrice();
      console.log("price:", domainPrice);
      setPrice(domainPrice);
    };
    updatePrice();
  }, [years]);

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
                  {isAvailable && (
                    <>
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
                    </>
                  )}
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
