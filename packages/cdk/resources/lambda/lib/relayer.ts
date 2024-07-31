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
    // call verify method
    const verifyResult = await forwarder.verify(request);
    console.log("verify result: ", verifyResult);
    if (!verifyResult) throw "invalid request data!";

    // call execute method from relayer
    const tx = await forwarder.connect(relayer).execute(request);
    await tx.wait();

    console.log("tx.hash:", tx.hash);
    result = tx.hash;
  } catch (error) {
    console.error("Error requestRelayer :", error);
  } finally {
    console.log(
      " ========================================= [RequestRaler: END] =============================================="
    );
    return null;
  }
};
