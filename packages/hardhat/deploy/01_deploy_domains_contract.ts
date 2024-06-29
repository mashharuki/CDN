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

  // deploy NFTMarketplace contract
  await deploy("NFTMarketplace", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });

  // get NFTMarket contract
  const marketPlace = await hre.ethers.getContract<Contract>(
    "NFTMarketplace",
    deployer
  );

  console.log(
    `NFTMarketplace Contract is deployed: ${await marketPlace.getAddress()}`
  );

  await deploy("Domains", {
    from: deployer,
    args: [tld, await forwarder.getAddress(), await marketPlace.getAddress()],
    log: true,
    autoMine: true,
  });

  // Get the deployed contract to interact with it after deploying.
  const domains = await hre.ethers.getContract<Contract>("Domains", deployer);

  console.log(`Domains Contract is deployed: ${await domains.getAddress()}`);

  console.log(
    `===================================== [set Domains address START] =====================================`
  );

  const txn = await marketPlace.setDomainsContract(await domains.getAddress());
  await txn.wait();

  console.log(`setDomainsAddress txn hash: ${txn.hash}`);

  console.log(
    `===================================== [set Domains address END] =====================================`
  );

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

  writeContractAddress({
    group: "contracts",
    name: "NFTMarketplace",
    value: await marketPlace.getAddress(),
    network: hre.network.name,
  });

  console.log(
    "===================================== [END] ===================================== "
  );
};

export default deployDomainsContract;

deployDomainsContract.tags = ["Domains"];
