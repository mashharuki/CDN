import "dotenv/config";
import {ethers} from "ethers";
import {task} from "hardhat/config";
import {recover} from "../lib/sss";

task("recoverSecret", "recoverSecret").setAction(async () => {
  // recover secret
  const recovered = recover();
  // get wallet
  const wallet = new ethers.Wallet(recovered);
  // output wallet address
  console.log(`wallet address: ${wallet.address}`);
});
