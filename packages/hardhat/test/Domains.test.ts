import {HardhatEthersSigner} from "@nomicfoundation/hardhat-ethers/signers";
import {expect} from "chai";
import {ethers} from "hardhat";
import {
  Domains,
  SampleForwarder,
  SampleForwarder__factory,
} from "../typechain-types";
import {ForwardRequest} from "../lib/types";

describe("Domains", function () {
  // We define a fixture to reuse the same setup in every test.

  /**
   * WakuWakuGame, NFT, Mock ERC20 token deploy function
   * @returns
   */
  async function deployContract() {
    const accounts = await ethers.getSigners();
    const account1: HardhatEthersSigner = accounts[0];
    const account2: HardhatEthersSigner = accounts[1];
    // console.log(accounts);
    // deploy Forwarder Contract
    const SampleForwarder: SampleForwarder__factory =
      await ethers.getContractFactory("SampleForwarder");
    const forwarder: SampleForwarder = await SampleForwarder.deploy();
    await forwarder.waitForDeployment();
    // deploy contract
    const Domains = await ethers.getContractFactory("Domains");
    const domains: Domains = await Domains.deploy("xcr", forwarder.target);
    await domains.waitForDeployment();

    return {domains, forwarder, account1, account2};
  }

  /**
   * create Request data
   */
  async function createRequestData(
    forwarder: SampleForwarder,
    domain: any,
    signer: any,
    to: string,
    value: number,
    data: any
  ) {
    // create signature
    const signature = await signer.signTypedData(
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
        from: signer.address,
        to: to,
        value: ethers.parseEther(value.toString()),
        gas: 360000,
        nonce: await forwarder.getNonce(signer.address),
        data: data,
      }
    );
    // verify signature
    const result = await forwarder.verify(
      {
        from: signer.address,
        to: to,
        value: ethers.parseEther(value.toString()),
        gas: 360000,
        nonce: await forwarder.getNonce(signer.address),
        data: data,
      },
      signature
    );
    // check result
    expect(result).to.equal(true);

    // create request data
    const request = {
      from: signer.address,
      to: to,
      value: ethers.parseEther(value.toString()),
      gas: 360000,
      nonce: await forwarder.getNonce(signer.address),
      data: data,
    };
    return {
      request: request,
      signature: signature,
    };
  }

  describe("Deployment", function () {
    it("Should have the right balance on deploy", async function () {
      const {domains} = await deployContract();
      const balance = await ethers.provider.getBalance(domains.target);
      const currentBalance = ethers.formatEther(balance);
      expect(currentBalance).to.equal("0.0");
    });

    it("check owner addrss", async function () {
      const {domains, account1} = await deployContract();
      const owner = await domains.owner();
      expect(account1.address).to.equal(owner);
    });

    it("check forwarder addrss", async function () {
      const {domains, forwarder} = await deployContract();
      expect(true).to.equal(await domains.isTrustedForwarder(forwarder.target));
    });
  });

  describe("Register", function () {
    it("Check Register function", async function () {
      const {domains, account1} = await deployContract();
      const txn = await domains.connect(account1).register("haruki", {
        value: ethers.parseEther("1234"),
      });
      await txn.wait();

      const domainOwner = await domains.domains("haruki");
      expect(domainOwner).to.equal(account1.address);

      const balance = await ethers.provider.getBalance(domains.target);
      const currentBalance = ethers.formatEther(balance);
      expect(currentBalance).to.equal("1234.0");
    });

    it("Check Register × 2 function", async function () {
      const {domains, account2} = await deployContract();
      const txn = await domains.register("haruki2", {
        value: ethers.parseEther("1234"),
      });
      await txn.wait();

      const txn2 = await domains.connect(account2).register("haruki3", {
        value: ethers.parseEther("1234"),
      });
      await txn2.wait();

      const domainOwner = await domains.domains("haruki3");
      expect(domainOwner).to.equal(account2.address);

      const balance = await ethers.provider.getBalance(domains.target);
      const currentBalance = ethers.formatEther(balance);
      expect(currentBalance).to.equal("2468.0");
    });

    it("Withdraw", async function () {
      const {domains, account1} = await deployContract();
      const txn = await domains.connect(account1).register("haruki4", {
        value: ethers.parseEther("1234"),
      });
      await txn.wait();

      const domainOwner = await domains.domains("haruki4");
      expect(domainOwner).to.equal(account1.address);

      const balance = await ethers.provider.getBalance(domains.target);
      const currentBalance = ethers.formatEther(balance);
      expect(currentBalance).to.equal("1234.0");

      await domains.withdraw();
      // check balance after withdraw
      const balance2 = await ethers.provider.getBalance(domains.target);
      const currentBalance2 = ethers.formatEther(balance2);
      expect(currentBalance2).to.equal("0.0");

      // get all names
      const allNames = await domains.getAllNames();
      expect(allNames.length).to.equal(1);
      expect(allNames[0]).to.equal("haruki4");
    });
  });

  describe("Gasless Register", function () {
    it("gasless register", async function () {
      const {domains, forwarder, account1, account2} = await deployContract();
      // create encode function data
      const data = domains.interface.encodeFunctionData("register", [
        "haruki5",
      ]);

      // get domain
      const domain = await forwarder.eip712Domain();

      // create relayer
      const relayer = account2;
      // creat request data
      const result = await createRequestData(
        forwarder,
        domain,
        account1,
        domains.target as string,
        1234,
        data
      );

      // execute
      await forwarder
        .connect(relayer)
        .execute(result.request, result.signature)
        .then(async (tx) => {
          tx.wait();
        });
    });
  });
});
