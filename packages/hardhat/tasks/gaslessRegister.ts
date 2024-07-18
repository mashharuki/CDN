import "dotenv/config";
import {task} from "hardhat/config";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {loadDeployedContractAddresses} from "../helper/contractsJsonHelper";
import {ForwardRequest} from "../lib/types";

const {RELAYER_PRIVATE_KEY} = process.env;

task("gaslessRegister", "gasless register new domain")
  .addParam("name", "register name")
  .addParam("year", "expire date")
  .setAction(async (taskArgs: any, hre: HardhatRuntimeEnvironment) => {
    console.log(
      "===================================== [START] ===================================== "
    );
    // get Contract Address
    const {
      contracts: {Domains, SampleForwarder},
    } = loadDeployedContractAddresses(hre.network.name);
    // create Domains contract
    const domains = await hre.ethers.getContractAt("Domains", Domains);
    const forwarder = await hre.ethers.getContractAt(
      "SampleForwarder",
      SampleForwarder
    );

    // 変数
    const name = taskArgs.name;
    const year = taskArgs.year;
    // デプロイするウォレットのアドレス
    const accounts = await hre.ethers.getSigners();
    const deployer = accounts[0];
    // relayer
    const relayer = new hre.ethers.Wallet(
      RELAYER_PRIVATE_KEY!,
      hre.ethers.provider
    );

    // create encode function data
    const data = domains.interface.encodeFunctionData("register", [
      deployer.address,
      name,
      year,
    ]);

    // get price
    const price = await domains.price("haruki5", 2);
    // get domain
    const domain = await forwarder.eip712Domain();
    // get deadline
    // get current blockchain timestamp
    const currentBlock = await hre.ethers.provider.getBlock("latest");
    const currentTime = currentBlock!.timestamp;
    // set deadline to be 5 minutes in the future
    const futureTime = currentTime + 5 * 60; // 5 minutes in seconds
    const uint48Time = BigInt(futureTime) % 2n ** 48n;

    try {
      // create signature
      const signature = await deployer.signTypedData(
        {
          name: domain.name,
          version: domain.version,
          chainId: domain.chainId,
          verifyingContract: domain.verifyingContract,
        },
        {
          ForwardRequest: ForwardRequest,
        },
        {
          from: deployer.address,
          to: domains.target,
          value: price.toString(),
          gas: 9000000n,
          nonce: await forwarder.nonces(deployer.address),
          deadline: uint48Time,
          data: data,
        }
      );
      // create request data
      const request = {
        from: deployer.address,
        to: domains.target,
        value: price.toString(),
        gas: 9000000n,
        nonce: await forwarder.nonces(deployer.address),
        deadline: uint48Time,
        data: data,
        signature: signature,
      };

      // check signature on chain before execute
      const verifyReslut = await forwarder.verify(request);
      console.log("verifyReslut:", verifyReslut);

      // send metx request
      const tx = await forwarder.connect(relayer).execute(request, {
        value: price.toString(),
      });
      await tx.wait();
      console.log("tx Hash:", tx.hash);

      console.log(
        "===================================== [END] ===================================== "
      );
    } catch (e) {
      console.error("err:", e);
    }
  });
