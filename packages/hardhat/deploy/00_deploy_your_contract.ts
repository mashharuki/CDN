import {HardhatRuntimeEnvironment} from "hardhat/types";
import {DeployFunction} from "hardhat-deploy/types";
import {Contract} from "ethers";
import {writeContractAddress} from "../helper/contractsJsonHelper";

const deployYourContract: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const {deployer} = await hre.getNamedAccounts();
  const {deploy} = hre.deployments;

  await deploy("YourContract", {
    from: deployer,
    args: [deployer],
    log: true,
    autoMine: true,
  });

  // Get the deployed contract to interact with it after deploying.
  const yourContract = await hre.ethers.getContract<Contract>(
    "YourContract",
    deployer
  );
  console.log("👋 Initial greeting:", await yourContract.greeting());

  // write Contract Address
  writeContractAddress({
    group: "contracts",
    name: "YourContract",
    value: await yourContract.getAddress(),
    network: hre.network.name,
  });
};

export default deployYourContract;

deployYourContract.tags = ["YourContract"];
