import {HardhatEthersSigner} from "@nomicfoundation/hardhat-ethers/signers";
import {time} from "@nomicfoundation/hardhat-network-helpers";
import {expect} from "chai";
import {ethers} from "hardhat";
import {ForwardRequest} from "../lib/types";
import {
  Domains,
  NFTMarketplace,
  NFTMarketplace__factory,
  SampleForwarder,
  SampleForwarder__factory,
} from "../typechain-types";

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
    // deploy NFTMarketPlace Contract
    const NFTMarketplace: NFTMarketplace__factory =
      await ethers.getContractFactory("NFTMarketplace");
    const marketplace: NFTMarketplace = await NFTMarketplace.deploy();
    await marketplace.waitForDeployment();
    // deploy contract
    const Domains = await ethers.getContractFactory("Domains");
    const domains: Domains = await Domains.deploy(
      "xcr",
      forwarder.target,
      marketplace.target
    );
    await domains.waitForDeployment();
    // NFTMarketplaceにDomainsをセット
    await marketplace.setDomainsContract(domains.target);

    return {domains, forwarder, marketplace, account1, account2};
  }

  /**
   * タイプスタンプをyyyy/mm/dd形式に変換するメソッド
   */
  const formatUnixTimestampBigInt = (timestamp: bigint): string => {
    // Unix タイムスタンプをミリ秒に変換
    const milliseconds = Number(timestamp) * 1000;
    const date = new Date(milliseconds);

    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2); // 月は0から始まるので +1
    const day = ("0" + date.getDate()).slice(-2);

    return `${year}/${month}/${day}`;
  };

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

  describe("Marketplace", function () {
    it("Should emit Domain Transfer event", async function () {
      const {domains, marketplace, account1} = await deployContract();
      const price = await domains.price("domain", 1);
      const txn = await domains.connect(account1).register("domain", 1, {
        value: ethers.parseEther(await ethers.formatEther(price)),
      });
      await txn.wait();

      // 有効期限を取得する。
      const expirationDate = await domains.expirationDates(0);
      console.log("expirationDate:", formatUnixTimestampBigInt(expirationDate));

      // 1年経過させる。
      await time.increase(365 * 24 * 60 * 60 + 1);

      // checkExpirationを実行し、トランザクションが成功するか確認する
      const tx = await domains.connect(account1).checkExpiration(0);

      // イベントがハッカしているか確認
      await expect(tx)
        .to.emit(domains, "DomainTransferred")
        .withArgs(0, marketplace.target);
    });
    it("Should list and buy domain successfully", async function () {
      const {domains, marketplace, account1, account2} = await deployContract();
      const price = await domains.price("domain", 1);
      const txn = await domains.connect(account1).register("domain", 1, {
        value: ethers.parseEther(await ethers.formatEther(price)),
      });
      await txn.wait();

      // 1年経過させる。
      await time.increase(365 * 24 * 60 * 60 + 1);

      const txn2 = await domains.connect(account1).checkExpiration(0);
      await txn2.wait();

      // イベントが発火しているか確認
      await expect(txn2)
        .to.emit(marketplace, "Listed")
        .withArgs(0, domains.target);

      // リストされているドメインを取得する。
      const listedDomain = marketplace.listings(0);

      expect((await listedDomain).tokenId).to.equal(0);
      expect((await listedDomain).seller).to.equal(domains.target);

      // リストされているドメインを一覧で取得する。
      const allListings = await marketplace.getAllListings();
      // 一覧で取得したデータの中身をチェックする。
      expect(allListings.length).to.equal(1);
      expect(allListings[0][0]).to.equal(0);
      expect(allListings[0][1]).to.equal(domains.target);

      await marketplace.connect(account2).buyItem(0, "domain", 1, {
        value: ethers.parseEther("0.01"),
      });

      // リストされているドメインが一件もないことを確認する。
      const allListings2 = await marketplace.getAllListings();
      // 一覧で取得したデータの中身をチェックする。
      expect(allListings2.length).to.equal(0);

      const domainOwner = await domains.domains("domain");
      expect(domainOwner).to.equal(account2.address);
    });

    it("Should emit BuyItem event", async function () {
      const {domains, marketplace, account1, account2} = await deployContract();
      const price = await domains.price("sample", 1);
      const txn = await domains.connect(account1).register("sample", 1, {
        value: ethers.parseEther(await ethers.formatEther(price)),
      });
      await txn.wait();

      // 1年経過させる。
      await time.increase(365 * 24 * 60 * 60 + 1);

      const txn2 = await domains.connect(account1).checkExpiration(0);
      await txn2.wait();

      await expect(
        marketplace.connect(account2).buyItem(0, "sample", 1, {
          value: ethers.parseEther("0.01"),
        })
      )
        .to.emit(marketplace, "Sold")
        .withArgs(0, account2.address, price);
    });
  });

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
      // priceを取得
      const price = await domains.price("haruki", 2);
      const txn = await domains.connect(account1).register("haruki", 2, {
        value: ethers.parseEther(await ethers.formatEther(price)),
      });
      await txn.wait();

      const domainOwner = await domains.domains("haruki");
      expect(domainOwner).to.equal(account1.address);

      const balance = await ethers.provider.getBalance(domains.target);
      const currentBalance = ethers.formatEther(balance);
      expect(currentBalance).to.equal("0.01");
    });

    it("Check Register × 2 function", async function () {
      const {domains, account2} = await deployContract();
      // priceを取得
      const price = await domains.price("haruki2", 2);
      const txn = await domains.register("haruki2", 2, {
        value: ethers.parseEther(await ethers.formatEther(price)),
      });
      await txn.wait();

      // priceを取得
      const price2 = await domains.price("haruki3", 2);
      const txn2 = await domains.connect(account2).register("haruki3", 2, {
        value: ethers.parseEther(await ethers.formatEther(price2)),
      });
      await txn2.wait();

      const domainOwner = await domains.domains("haruki3");
      expect(domainOwner).to.equal(account2.address);

      const balance = await ethers.provider.getBalance(domains.target);
      const currentBalance = ethers.formatEther(balance);
      expect(currentBalance).to.equal("0.02");
    });

    it("get DomainsByOwner after Register × 2 function", async function () {
      const {domains, account1} = await deployContract();
      // priceを取得
      const price = await domains.price("haruki2", 2);
      const txn = await domains.register("haruki2", 2, {
        value: ethers.parseEther(await ethers.formatEther(price)),
      });
      await txn.wait();

      // priceを取得
      const price2 = await domains.price("haruki3", 2);
      const txn2 = await domains.register("haruki3", 2, {
        value: ethers.parseEther(await ethers.formatEther(price2)),
      });
      await txn2.wait();

      // get Domains By Owner
      const domainsByOwner = await domains.getDomainsByOwner(account1.address);
      expect(domainsByOwner.length).to.equal(2);
      expect(domainsByOwner[0]).to.equal("haruki2");
      expect(domainsByOwner[1]).to.equal("haruki3");
    });

    it("Withdraw", async function () {
      const {domains, account1} = await deployContract();
      // priceを取得
      const price = await domains.price("haruki4", 2);
      const txn = await domains.connect(account1).register("haruki4", 2, {
        value: ethers.parseEther(await ethers.formatEther(price)),
      });
      await txn.wait();

      const domainOwner = await domains.domains("haruki4");
      expect(domainOwner).to.equal(account1.address);

      const balance = await ethers.provider.getBalance(domains.target);
      const currentBalance = ethers.formatEther(balance);
      expect(currentBalance).to.equal("0.01");

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

    it("Should burn domain after expiration", async function () {
      const {domains, account1} = await deployContract();
      const price = await domains.price("expire", 1);
      const txn = await domains.connect(account1).register("expire", 1, {
        value: ethers.parseEther(await ethers.formatEther(price)),
      });
      await txn.wait();

      const domainOwner = await domains.domains("expire");
      expect(domainOwner).to.equal(account1.address);
      // 1年経過させる。
      await time.increase(365 * 24 * 60 * 60 + 1);
      // check expired
      const txn2 = await domains.connect(account1).checkExpiration(0);
      await txn2.wait();
      // 所有状況を確認する。
      const expiredOwner = await domains.domains("expire");
      expect(expiredOwner).to.equal(ethers.ZeroAddress);
    });
  });

  describe("Gasless Register", function () {
    it("gasless register", async function () {
      const {domains, forwarder, account1, account2} = await deployContract();
      // create encode function data
      const data = domains.interface.encodeFunctionData("register", [
        "haruki5",
        2,
      ]);

      // get domain
      const domain = {
        name: "MinimalForwarder",
        version: "0.0.1",
        chainId: 31337,
        verifyingContract: domains.target,
      };
      // get price
      const price = await domains.price("haruki5", 2);

      // create relayer
      const relayer = account2;
      // creat request data
      const result = await createRequestData(
        forwarder,
        domain,
        account1,
        domains.target as string,
        Number(await ethers.formatEther(price)),
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
