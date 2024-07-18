import "dotenv/config";
import {task} from "hardhat/config";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {loadDeployedContractAddresses} from "../helper/contractsJsonHelper";

task("register", "register new domain")
  .addParam("name", "register name")
  .addParam("amount", "send amount to register new domain name")
  .addParam("year", "expire date")
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
    const amount = taskArgs.amount;
    const year = taskArgs.year;
    // デプロイするウォレットのアドレス
    const accounts = await hre.ethers.getSigners();
    const deployer = accounts[0].address;

    try {
      // create game
      const tx = await domains.register(deployer, name, year, {
        value: hre.ethers.parseEther(amount),
      });
      console.log("tx Hash:", tx.hash);
      console.log(
        "===================================== [END] ===================================== "
      );
    } catch (e) {
      console.error("err:", e);
    }
  });
