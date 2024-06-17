import {Contract} from "ethers";
import {DeployFunction} from "hardhat-deploy/types";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {writeContractAddress} from "../helper/contractsJsonHelper";

const deployDomainsContract: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  console.log(
    "===================================== [START] ===================================== "
  );
  const {deployer} = await hre.getNamedAccounts();
  const {deploy} = hre.deployments;

  // Deploy SampleForwarder contract
  await deploy("SampleForwarder", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });

  // Get the deployed contract to interact with it after deploying.
  const forwarder = await hre.ethers.getContract<Contract>(
    "SampleForwarder",
    deployer
  );

  const tld = "xcr";

  await deploy("Domains", {
    from: deployer,
    args: [tld, await forwarder.getAddress()],
    log: true,
    autoMine: true,
  });

  // Get the deployed contract to interact with it after deploying.
  const domains = await hre.ethers.getContract<Contract>("Domains", deployer);

  console.log(`Domains Contract is deployed: ${await domains.getAddress()}`);

  // write Contract Address
  writeContractAddress({
    group: "contracts",
    name: "Domains",
    value: await domains.getAddress(),
    network: hre.network.name,
  });

  writeContractAddress({
    group: "contracts",
    name: "SampleForwarder",
    value: await forwarder.getAddress(),
    network: hre.network.name,
  });

  console.log(
    "===================================== [END] ===================================== "
  );
};

export default deployDomainsContract;

deployDomainsContract.tags = ["Domains"];
