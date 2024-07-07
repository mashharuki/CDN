"use client";

import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { PencilIcon } from "@heroicons/react/24/outline";
import MintCDHModal from "~~/components/MintCDHModal";
import Modal from "~~/components/Modal";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { formatUnixTimestampBigInt } from "~~/utils/helper";
import { getBlockExplorerAddressLink, getBlockExplorerTokenLink } from "~~/utils/scaffold-eth";

type DomainCardPorps = {
  id: number;
  name: string;
  cdhContractData?: any;
  deployedContractData?: any;
  nftMarketContractData?: any;
  filter: string;
};

/**
 * DomainCard Components
 * @returns
 */
export const DomainCard = (porps: DomainCardPorps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMintCDHOpen, setIsMintCDHOpen] = useState(false);
  const [expirationDate, setExpirationDate] = useState("");

  const {} = useWriteContract();
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
  // get owner
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
  // get tokenUri
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
  // get expirationDate
  const { data: expirationDateBigInt, refetch: getExpirationDate } = useReadContract({
    address: porps.deployedContractData.address,
    functionName: "expirationDates",
    abi: porps.deployedContractData.abi,
    args: [porps.id],
    chainId: targetNetwork.id,
    query: {
      enabled: false,
      retry: false,
    },
  });
  // get CDH's balance
  const { data: balance, refetch: getBalance } = useReadContract({
    address: porps.cdhContractData.address,
    functionName: "balanceOf",
    abi: porps.cdhContractData.abi,
    args: [address as string],
    chainId: targetNetwork.id,
    query: {
      enabled: false,
      retry: true,
    },
  });

  /**
   * format address
   */
  const formatDisplayAddress = (str: string): string => {
    if (str.length < 6) return "Invalid string";
    const firstThree = str.slice(2, 5);
    const lastThree = str.slice(-3);
    return firstThree + "..." + lastThree;
  };

  /**
   * listItem method
  const listItem = async () => {
    try {
      const result = await writeContractAsync({
        address: porps.nftMarketContractData.address,
        functionName: "listItem",
        abi: porps.nftMarketContractData.abi,
        args: [porps.id],
      });

      console.log("result:", result);

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
  */

  useEffect(() => {
    const init = async () => {
      await getRecord();
      await getOwner();
      await getTokenUri();
      await getExpirationDate();
      await getBalance();
      console.log("owner:", owner);
      console.log("record:", record);
      console.log("tokenUri:", tokenUri);
      console.log("balance:", balance);
      console.log("expirationDateBigInt:", expirationDateBigInt);
    };
    init();
  }, []);

  useEffect(() => {
    const YYYYMMDD_expirationDate = formatUnixTimestampBigInt(expirationDateBigInt as any);
    setExpirationDate(YYYYMMDD_expirationDate);
  }, [expirationDateBigInt]);

  if (porps.filter == "myDomains") {
    return (
      <>
        <Modal
          open={isOpen}
          onCancel={() => setIsOpen(false)}
          onOk={() => setIsOpen(false)}
          deployedContractData={porps.deployedContractData}
          domain={porps.name}
        />
        <MintCDHModal
          open={isMintCDHOpen}
          onCancel={() => setIsMintCDHOpen(false)}
          onOk={() => setIsMintCDHOpen(false)}
          deployedContractData={porps.deployedContractData}
          address={address as string}
        />
        {record != undefined && owner != undefined && (
          <>
            {owner == address ? (
              <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2">
                <div className="card w-96 text-primary-content m-2 bg-gradient-to-r from-blue-500 via-orange-500 to-pink-500 text-white p-5 rounded-lg shadow-lg transition-transform transform hover:scale-105">
                  <div className="card-body">
                    <h2 className="card-title">{porps.name}.xcr</h2>
                    <h5>
                      <a
                        className="underline"
                        target="_blank"
                        href={getBlockExplorerTokenLink(targetNetwork, porps.deployedContractData.address, porps.id)}
                      >
                        ID: {porps.id}
                      </a>
                    </h5>
                    <p>
                      <a
                        className="underline"
                        target="_blank"
                        href={getBlockExplorerAddressLink(targetNetwork, owner as any)}
                      >
                        owner: {formatDisplayAddress(owner as any)}
                      </a>
                    </p>
                    <p>
                      <a className="underline" target="_blank" href={record as any}>
                        record: {record as any}
                      </a>
                    </p>
                    <p>
                      <strong>expirationDate: {expirationDate}</strong>
                    </p>
                  </div>
                  {balance != undefined && (
                    <>
                      {balance != 0 ? (
                        <p>
                          <a
                            className="underline"
                            target="_blank"
                            href={getBlockExplorerAddressLink(targetNetwork, porps.cdhContractData.address as any)}
                          >
                            Check Your CDH
                          </a>
                        </p>
                      ) : (
                        <button
                          onClick={() => setIsMintCDHOpen(true)}
                          className="absolute bottom-4 right-12 bg-white text-blue-500 rounded-full p-2 mr-1 shadow-lg hover:bg-gray-200 transition-colors"
                        >
                          Mint CDH
                        </button>
                      )}
                    </>
                  )}
                  <button
                    onClick={() => setIsOpen(true)}
                    className="absolute bottom-4 right-3 bg-white text-blue-500 rounded-full p-2 shadow-lg hover:bg-gray-200 transition-colors"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  {/*
                  <div>
                    <button
                      onClick={listItem}
                      className="bottom-4 right-3 bg-white text-blue-500 rounded-full p-2 shadow-lg hover:bg-gray-200 transition-colors"
                    >
                      <ShoppingCartIcon className="h-5 w-5" />
                    </button>
                  </div>
                  */}
                </div>
              </div>
            ) : (
              <></>
            )}
          </>
        )}
      </>
    );
  } else {
    return (
      <>
        <Modal
          open={isOpen}
          onCancel={() => setIsOpen(false)}
          onOk={() => setIsOpen(false)}
          deployedContractData={porps.deployedContractData}
          domain={porps.name}
        />
        <MintCDHModal
          open={isMintCDHOpen}
          onCancel={() => setIsMintCDHOpen(false)}
          onOk={() => setIsMintCDHOpen(false)}
          deployedContractData={porps.deployedContractData}
          address={address as string}
        />
        {record != undefined && owner != undefined && (
          <div className="card w-96 text-primary-content m-2 bg-gradient-to-r from-blue-500 via-orange-500 to-pink-500 text-white p-5 rounded-lg shadow-lg transition-transform transform hover:scale-105">
            <div className="card-body">
              <h2 className="card-title">{porps.name}.xcr</h2>
              <h5>
                ID:{" "}
                <a
                  className="underline"
                  target="_blank"
                  href={getBlockExplorerTokenLink(targetNetwork, porps.deployedContractData.address, porps.id)}
                >
                  {porps.id}
                </a>
              </h5>
              <p>
                owner:{" "}
                <a
                  className="underline"
                  target="_blank"
                  href={getBlockExplorerAddressLink(targetNetwork, owner as any)}
                >
                  0x{formatDisplayAddress(owner as any)}
                </a>
              </p>
              <p>
                record:{" "}
                <a className="underline" target="_blank" href={record as any}>
                  {record as any}
                </a>
              </p>
              <p>
                <strong>expirationDate: {expirationDate}</strong>
              </p>
            </div>
            {owner == address && (
              <>
                {balance != undefined && (
                  <>
                    {balance != 0 ? (
                      <p>
                        <a
                          className="underline"
                          target="_blank"
                          href={getBlockExplorerAddressLink(targetNetwork, porps.cdhContractData.address as any)}
                        >
                          Check Your CDH
                        </a>
                      </p>
                    ) : (
                      <button
                        onClick={() => setIsMintCDHOpen(true)}
                        className="absolute bottom-4 right-12 bg-white text-blue-500 rounded-full p-2 mr-1 shadow-lg hover:bg-gray-200 transition-colors"
                      >
                        Mint CDH
                      </button>
                    )}
                  </>
                )}
                <button
                  onClick={() => setIsOpen(true)}
                  className="absolute bottom-4 right-3 bg-white text-blue-500 rounded-full p-2 shadow-lg hover:bg-gray-200 transition-colors"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
                {/*
                <div>
                  <button
                    onClick={listItem}
                    className="bottom-4 right-3 bg-white text-blue-500 rounded-full p-2 shadow-lg hover:bg-gray-200 transition-colors"
                  >
                    <ShoppingCartIcon className="h-5 w-5" />
                  </button>
                </div>
                */}
              </>
            )}
          </div>
        )}
      </>
    );
  }
};
