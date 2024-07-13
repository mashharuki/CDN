import { ForwardRequest } from "./types";
import { ethers } from "ethers";

/**
 * getMetaTxTypeData method
 * @param chainId
 * @param verifyingContract
 * @returns
 */
const getMetaTxTypeData = (chainId: number, verifyingContract: string) => {
  // Specification of the eth_signTypedData JSON RPC
  return {
    types: {
      ForwardRequest,
    },
    domain: {
      name: "MinimalForwarder",
      version: "0.0.1",
      chainId,
      verifyingContract,
    },
    primaryType: "ForwardRequest",
  };
};

/**
 * signTypeData method
 * @param signer
 * @param data
 * @returns
 */
const signTypeData = async (signer: any, data: any) => {
  return await signer.signTypedData(data.domain, data.types, data.message);
};

/**
 * buildRequest method
 * @param forwarder
 * @param input
 * @param numberOfMint
 * @param value
 * @returns
 */
const buildRequest = async (forwarder: any, input: any, value: number) => {
  // get nonce from forwarder contract
  // this nonce is used to prevent replay attack
  const nonce = (await forwarder.getNonce(input.from)).toString();
  const gas = 3600000;
  return {
    value: ethers.parseEther(value.toString()),
    gas: gas,
    nonce,
    ...input,
  };
};

/**
 * buildTypedData method
 * @param domain
 * @param request
 * @param chainId
 * @returns
 */
const buildTypedData = async (domain: any, request: any, chainId: number) => {
  const typeData = getMetaTxTypeData(chainId, domain.target);
  return { ...typeData, message: request };
};

/**
 * signMetaTxRequest method
 * @param signer
 * @param forwarder
 * @param input
 * @param value
 * @param chainId
 * @returns
 */
export const signMetaTxRequest = async (signer: any, forwarder: any, input: any, value: number, chainId: number) => {
  const request = await buildRequest(forwarder, input, value);
  const toSign = await buildTypedData(forwarder, request, chainId);
  const signature = await signTypeData(signer, toSign);
  return { signature, request };
};
