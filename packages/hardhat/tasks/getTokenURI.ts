import "dotenv/config";
import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { loadDeployedContractAddresses } from "../helper/contractsJsonHelper";

task("getTokenURI", "get tokenURI of id")
  .addParam("tokenid", "tokenId")
  .setAction(async (taskArgs: any, hre: HardhatRuntimeEnvironment) => {
    console.log(
      "===================================== [START] ===================================== "
    );
    
    // get Contract Address
    const {
      contracts: {Domains},
    } = loadDeployedContractAddresses(hre.network.name);
    // create Domains contract
    const domains = await hre.ethers.getContractAt("Domains", Domains);

    // 変数
    const tokenId = taskArgs.tokenid;

    try {
      // get tokenURI
      const result = await domains.tokenURI(tokenId);
      console.log(`TokenID ${tokenId}'s tokenURI: ${result}`);
      console.log(
        "===================================== [END] ===================================== "
      );
    } catch (e) {
      console.error("err:", e);
    }
  });
