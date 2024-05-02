import {expect} from "chai";
import {ethers} from "hardhat";
import {Domains} from "../typechain-types";
import {HardhatEthersSigner} from "@nomicfoundation/hardhat-ethers/signers";

describe("Domains", function () {
  // We define a fixture to reuse the same setup in every test.

  let domains: Domains;
  let account1: HardhatEthersSigner;
  let account2: HardhatEthersSigner;
  const deployerAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  before(async () => {
    const accounts = await ethers.getSigners();
    account1 = accounts[0];
    account2 = accounts[1];
    console.log(accounts);
    // deploy contract
    const Domains = await ethers.getContractFactory("Domains");
    domains = (await Domains.deploy("xcr")) as Domains;
    await domains.waitForDeployment();
  });

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
      const txn = await domains.register("haruki", {
        value: ethers.parseEther("1234"),
      });
      await txn.wait();

      const domainOwner = await domains.getAddress("haruki");
      expect(domainOwner).to.equal(deployerAddress);

      const balance = await ethers.provider.getBalance(domains.target);
      const currentBalance = ethers.formatEther(balance);
      expect(currentBalance).to.equal("1234.0");
    });

    it("Withdraw", async function () {
      const txn = await domains.register("haruki2", {
        value: ethers.parseEther("1234"),
      });
      await txn.wait();

      const domainOwner = await domains.getAddress("haruki2");
      expect(domainOwner).to.equal(deployerAddress);

      const balance = await ethers.provider.getBalance(domains.target);
      const currentBalance = ethers.formatEther(balance);
      expect(currentBalance).to.equal("2468.0");

      await domains.withdraw();
      // check balance after withdraw
      const balance2 = await ethers.provider.getBalance(domains.target);
      const currentBalance2 = ethers.formatEther(balance2);
      expect(currentBalance2).to.equal("0.0");
    });
  });
});
