import React, { useState } from "react";
import { toast } from "react-toastify";
import { useWriteContract } from "wagmi";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { ContractName } from "~~/utils/scaffold-eth/contract";
import { getAllContracts } from "~~/utils/scaffold-eth/contractsData";

export type ModalProps = {
  open: boolean;
  onCancel: () => void;
  onOk: () => void;
  deployedContractData?: any;
  address: string;
};

/**
 * Modal Component
 * @param props
 * @returns
 */
const MintCDHModal = (props: ModalProps) => {
  const [tokenUri, setTokenUri] = useState("");

  const { writeContractAsync } = useWriteContract();

  const contractsData = getAllContracts();
  const contractNames = Object.keys(contractsData) as ContractName[];
  // get contractData
  const { data: deployedContractData } = useDeployedContractInfo(contractNames[2]);

  /**
   * mintCDH
   */
  const mintCDH = async () => {
    console.log("address:", props.address);
    console.log("tokenUri:", tokenUri);
    try {
      const result = await writeContractAsync({
        address: deployedContractData.address,
        functionName: "safeMint",
        abi: deployedContractData.abi,
        args: [props.address, tokenUri],
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

  return props.open ? (
    <>
      <div className="bg-white rounded-lg shadow-lg transform -translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 w-96 p-8 flex flex-col items-center z-20">
        <h1 className="text-2xl font-bold text-gray-700 mb-4">Mint CDH</h1>
        <p className="text-lg text-gray-600 mb-6">Enter TokenURI</p>
        <input
          type="text"
          name="tokenURI"
          id="tokenURI"
          onChange={(e: any) => setTokenUri(e.target.value)}
          className="block w-full rounded-lg border bg-gray-600 border-gray-300 py-2 px-4 text-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 mb-4"
        />
        <button
          className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-6 py-2 transition duration-300 ease-in-out"
          onClick={async () => {
            mintCDH();
          }}
        >
          Mint CDH
        </button>
      </div>
      <div className="fixed inset-0 bg-black bg-opacity-50 w-full h-full z-10" onClick={() => props.onCancel()}></div>
    </>
  ) : (
    <></>
  );
};

export default MintCDHModal;
