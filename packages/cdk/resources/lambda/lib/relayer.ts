import {Contract, ethers} from "ethers";
import {SAMPLEFORWARDER_ABI} from "./../util/abi";
import {RPC_URL, SAMPLEFORWARDER_ADDRESS} from "./../util/constants";

// 環境変数を取得する。
const {RELAYER_PRIVATE_KEY} = process.env;

/**
 * リクエストをブロックチェーンに送信するメソッド
 */
export const requestRelayer = async (request: any) => {
  console.log(
    " ========================================= [RequestRaler: START] =============================================="
  );
  // プロバイダーを作成
  const provider = new ethers.JsonRpcProvider(RPC_URL);

  // get relayer
  const relayer = new ethers.Wallet(RELAYER_PRIVATE_KEY!, provider);
  // create forwarder contract instance
  const forwarder: any = new Contract(
    SAMPLEFORWARDER_ADDRESS,
    SAMPLEFORWARDER_ABI,
    relayer
  ) as any;

  console.log("relayer:", relayer.address);

  let result;

  try {
    console.log("request:", request);
    // call verify method
    const verifyResult = await forwarder
      .connect(relayer)
      .verify(request.request);
    console.log("verify result: ", verifyResult);
    if (!verifyResult) throw "invalid request data!";
    /*
    // estimate gas
    const estimateGas = await forwarder.execute.estimateGas(request.request);

    console.log("estimateGas:", estimateGas.toString());
    */

    // call execute method from relayer
    const tx = await forwarder.connect(relayer).execute(request.request, {
      value: request.request.value,
      gas: 90000000,
    });
    // await tx.wait();

    console.log("tx.hash:", tx.hash);
    result = tx.hash;
  } catch (error) {
    console.error("Error requestRelayer :", error);
  } finally {
    console.log(
      " ========================================= [RequestRaler: END] =============================================="
    );
    return result;
  }
};
