import "dotenv/config";
import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { loadDeployedContractAddresses } from "../helper/contractsJsonHelper";

task("price", "check price new domain")
  .addParam("name", "check price name")
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
    const name = taskArgs.name;

    try {
      // check price
      const result = await domains.price(name);
      console.log(`price: ${hre.ethers.formatEther(result.toString())} ETH`);
      console.log(
        "===================================== [END] ===================================== "
      );
    } catch (e) {
      console.error("err:", e);
    }
  });
