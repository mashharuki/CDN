import {HardhatEthersSigner} from "@nomicfoundation/hardhat-ethers/signers";
import {expect} from "chai";
import {ethers} from "hardhat";
import {recover} from "../lib/sss";
import {ForwardRequest} from "../lib/types";
import {
  Domains,
  SampleForwarder,
  SampleForwarder__factory,
} from "../typechain-types";

describe("Domains", function () {
  // We define a fixture to reuse the same setup in every test.

  let domains: Domains;
  let forwarder: SampleForwarder;
  let account1: HardhatEthersSigner;
  let account2: HardhatEthersSigner;
  let deployerAddress: string;

  before(async () => {
    const accounts = await ethers.getSigners();
    account1 = accounts[0];
    account2 = accounts[1];
    console.log(accounts);

    deployerAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

    // deploy Forwarder Contract
    const SampleForwarder: SampleForwarder__factory =
      await ethers.getContractFactory("SampleForwarder");
    forwarder = await SampleForwarder.deploy();
    await forwarder.waitForDeployment();
    // deploy contract
    const Domains = await ethers.getContractFactory("Domains");
    domains = (await Domains.deploy("xcr", forwarder.target)) as Domains;
    await domains.waitForDeployment();
  });

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
      signature: signature,
    };
    return request;
  }

  describe("Deployment", function () {
    it("Should have the right balance on deploy", async function () {
      const balance = await ethers.provider.getBalance(domains.target);
      const currentBalance = ethers.formatEther(balance);
      expect(currentBalance).to.equal("0.0");
    });

    it("check owner addrss", async function () {
      const owner = await domains.owner();
      expect(account1.address).to.equal(owner);
    });
  });

  describe("Register", function () {
    it("Check Register function", async function () {
      const txn = await domains.connect(account1).register("haruki", {
        value: ethers.parseEther("1234"),
      });
      await txn.wait();

      const domainOwner = await domains.getAddress("haruki");
      expect(domainOwner).to.equal(deployerAddress);

      const balance = await ethers.provider.getBalance(domains.target);
      const currentBalance = ethers.formatEther(balance);
      expect(currentBalance).to.equal("1234.0");
    });

    it("Check Register × 2 function", async function () {
      const txn = await domains.register("haruki2", {
        value: ethers.parseEther("1234"),
      });
      await txn.wait();

      const txn2 = await domains.connect(account2).register("haruki3", {
        value: ethers.parseEther("1234"),
      });
      await txn2.wait();

      const domainOwner = await domains.getAddress("haruki");
      expect(domainOwner).to.equal(deployerAddress);

      const balance = await ethers.provider.getBalance(domains.target);
      const currentBalance = ethers.formatEther(balance);
      expect(currentBalance).to.equal("3702.0");
    });

    it("Withdraw", async function () {
      const txn = await domains.register("haruki4", {
        value: ethers.parseEther("1234"),
      });
      await txn.wait();

      const domainOwner = await domains.getAddress("haruki4");
      expect(domainOwner).to.equal(deployerAddress);

      const balance = await ethers.provider.getBalance(domains.target);
      const currentBalance = ethers.formatEther(balance);
      expect(currentBalance).to.equal("4936.0");

      await domains.withdraw();
      // check balance after withdraw
      const balance2 = await ethers.provider.getBalance(domains.target);
      const currentBalance2 = ethers.formatEther(balance2);
      expect(currentBalance2).to.equal("0.0");

      // get all names
      const allNames = await domains.getAllNames();
      expect(allNames.length).to.equal(4);
      expect(allNames[0]).to.equal("haruki");
    });
  });

  describe("Gasless Register", function () {
    it("check forwarder address", async function () {
      expect(true).to.equal(await domains.isTrustedForwarder(forwarder.target));
    });

    it("gasless register", async function () {
      // create encode function data
      const data = domains.interface.encodeFunctionData("register", [
        "haruki5",
      ]);

      // get domain
      const domain = {
        types: {
          ForwardRequest,
        },
        domain: {
          name: "MinimalForwarder",
          version: "0.0.1",
          chainId: 31337,
          verifyingContract: domains.target,
        },
        primaryType: "ForwardRequest",
      };

      // create relayer
      const relayer = new ethers.Wallet(recover());
      // creat request data
      const request = await createRequestData(
        forwarder,
        domain,
        account1,
        domains.target as string,
        1234,
        data
      );
    });
  });
});
