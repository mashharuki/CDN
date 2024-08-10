import { useState } from "react";
import { Contract, ethers } from "ethers";
import { toast } from "react-toastify";
import { useWriteContract } from "wagmi";
import { POST } from "~~/app/api/requestRelayer/route";
import { useDeployedContractInfo, useEthersSigner } from "~~/hooks/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { RPC_URL } from "~~/utils/constants";
import { getUint48 } from "~~/utils/helper";
import { ContractName } from "~~/utils/scaffold-eth/contract";
import { getAllContracts } from "~~/utils/scaffold-eth/contractsData";
import { ForwardRequest } from "~~/utils/types";

export type ModalProps = {
  open: boolean;
  onCancel: () => void;
  onOk: () => void;
  deployedContractData?: any;
  domain: string;
};

/**
 * Modal Component
 * @param props
 * @returns
 */
const Modal = (props: ModalProps) => {
  const contractsData = getAllContracts();
  const contractNames = Object.keys(contractsData) as ContractName[];
  const [newRecord, setNewRecord] = useState("");

  const {} = useWriteContract();
  const { targetNetwork } = useTargetNetwork();

  const { data: SampleForwarderContractData } = useDeployedContractInfo(contractNames[2]);

  // get signer object
  const signer = useEthersSigner({ chainId: targetNetwork.id });

  /**
   * setRecord
   */
  const setRecord = async () => {
    try {
      // create Contract object
      const domains: any = new Contract(
        props.deployedContractData.address,
        props.deployedContractData.abi,
        signer,
      ) as any;
      const forwarder: any = new Contract(
        SampleForwarderContractData.address,
        SampleForwarderContractData.abi,
        signer,
      ) as any;
      // generate encoded data
      const data = domains.interface.encodeFunctionData("setRecord", [props.domain, newRecord]);
      // get EIP712 domain
      const eip721Domain = await forwarder.eip712Domain();
      const provider = new ethers.JsonRpcProvider(RPC_URL);
      // get current block
      const currentBlock = await provider.getBlock("latest");
      const currentTime = currentBlock!.timestamp;
      // get deadline
      const uint48Time = await getUint48(currentTime);
      console.log("getUint48:", uint48Time);

      // creat metaTx request data
      const signature = await signer!.signTypedData(
        {
          name: eip721Domain.name,
          version: eip721Domain.version,
          chainId: eip721Domain.chainId,
          verifyingContract: eip721Domain.verifyingContract,
        },
        {
          ForwardRequest: ForwardRequest,
        },
        {
          from: signer?.address,
          to: domains.target,
          value: 0,
          gas: 9000000,
          nonce: await forwarder.nonces(signer?.address),
          deadline: uint48Time,
          data: data,
        },
      );

      console.log("signature:", signature);

      // call execute method from relayer
      await POST({
        request: {
          from: signer?.address,
          to: domains.target,
          value: 0,
          gas: 9000000,
          //nonce: (await forwarder.nonces(signer?.address)).toString(),
          deadline: uint48Time.toString(),
          data: data,
          signature: signature,
        },
      });

      /*
      // register domain
      await writeContractAsync({
        address: props.deployedContractData.address,
        functionName: "setRecord",
        abi: props.deployedContractData.abi,
        args: [props.domain as any, newRecord],
        chainId: targetNetwork.id,
      });
      */
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
        <h1 className="text-2xl font-bold text-gray-700 mb-4">Edit Record</h1>
        <p className="text-lg text-gray-600 mb-6">Enter New Record</p>
        <input
          type="text"
          name="record"
          id="record"
          onChange={(e: any) => setNewRecord(e.target.value)}
          className="block w-full rounded-lg border bg-gray-600 border-gray-300 py-2 px-4 text-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 mb-4"
        />
        <button
          className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-6 py-2 transition duration-300 ease-in-out"
          onClick={async () => await setRecord()}
        >
          Register
        </button>
      </div>
      <div className="fixed inset-0 bg-black bg-opacity-50 w-full h-full z-10" onClick={() => props.onCancel()}></div>
    </>
  ) : (
    <></>
  );
};

export default Modal;
