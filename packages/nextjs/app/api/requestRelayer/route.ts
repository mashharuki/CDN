import { Contract, ethers } from "ethers";
import deployedContracts from "~~/contracts/deployedContracts";

const { RELAYER_PRIVATE_KEY } = process.env;

/**
 * requestRelayer API
 * @param req
 * @param res
 */
export async function POST(request: any) {
  console.log(
    " ========================================= [RequestRaler: START] ==============================================",
  );

  const data = request.json();
  console.log("data:", data);
  const body: any = request?.body;
  if (body === undefined) {
    return new Response("Request has no body", {
      status: 503,
    });
  }

  console.log("body:", request.body);

  // get relayer
  const relayer: any = new ethers.Wallet(RELAYER_PRIVATE_KEY!);
  // create forwarder contract instance
  const forwarder: any = new Contract(
    deployedContracts[5555].SampleForwarder.address,
    deployedContracts[5555].SampleForwarder.abi,
    relayer,
  ) as any;

  try {
    // call verify method
    const result = await forwarder.verify(request, body!.signature);
    console.log("verify result: ", result);
    if (!result) throw "invalid request data!";

    // call execute method from relayer
    await forwarder.execute(request, body.signature);

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
