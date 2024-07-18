import { Contract, ethers } from "ethers";
import deployedContracts from "~~/contracts/deployedContracts";
import { RPC_URL } from "~~/utils/constants";

/**
 * requestRelayer API
 * @param requestData
 */
export async function POST(requestData: any) {
  console.log(
    " ========================================= [RequestRaler: START] ==============================================",
  );

  console.log("request:", requestData?.request);
  const request: any = requestData?.request;
  const provider = new ethers.JsonRpcProvider(RPC_URL);

  if (request === undefined) {
    return new Response("Request has no request", {
      status: 503,
    });
  }

  if (process.env.NEXT_PUBLIC_RELAYER_PRIVATE_KEY === undefined) {
    console.error("NEXT_PUBLIC_RELAYER_PRIVATE_KEY must be set");
    return new Response("NEXT_PUBLIC_RELAYER_PRIVATE_KEY must be set", {
      status: 503,
    });
  }

  // get relayer
  const relayer = new ethers.Wallet(process.env.NEXT_PUBLIC_RELAYER_PRIVATE_KEY, provider);
  // create forwarder contract instance
  const forwarder: any = new Contract(
    deployedContracts[5555].SampleForwarder.address,
    deployedContracts[5555].SampleForwarder.abi,
    relayer,
  ) as any;

  console.log("relayer:", relayer.address);

  try {
    // call verify method
    const result = await forwarder.verify(request);
    console.log("verify result: ", result);
    if (!result) throw "invalid request data!";

    // call execute method from relayer
    const tx = await forwarder.connect(relayer).execute(request);
    await tx.wait();

    console.log("tx.hash:", tx.hash);

    console.log(
      " ========================================= [RequestRaler: END] ==============================================",
    );

    return new Response("ok", {
      status: 200,
      headers: {
        "Content-Type": "text/json",
      },
    });
  } catch (error) {
    console.error("Error requestRelayer :", error);
    console.log(
      " ========================================= [RequestRaler: END] ==============================================",
    );

    return new Response("failed", {
      status: 503,
      headers: {
        "Content-Type": "text/json",
      },
    });
  }
}
