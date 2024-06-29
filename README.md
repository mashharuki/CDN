# 🏗 CrossValueChain Domain Name Service (CDN)

[![Lint & Test Smart Contracts](https://github.com/mashharuki/CDN/actions/workflows/lint.yaml/badge.svg)](https://github.com/mashharuki/CDN/actions/workflows/lint.yaml)

## What it does

The CrossValueChain Domain Name Service simplifies the ethereal address, which is a long string of alphanumeric characters starting with "0x," to make it easier to remember and simpler to use as a string of characters(like ENS).

The CrossValueChain Domain is minted as NFT(ERC721).

## Technologies I used

Next.js  
hardhat  
TypeScript  
openzeppelin  
ERC721  
yarn workspaces  
Scaffold-ETH 2  
ethers.js V6
CrossValueChain

## Update Points

### Wave1

SetUp Template project with Scaffold-ETH 2.

I have changed the settings to work with CrossValueChainTestnet & developed DomainName Contract(ERC721).

[DomainName Contract's code](https://github.com/mashharuki/CDN/blob/main/packages/hardhat/contracts/Domains.sol)

[DomainName Contract's test code](https://github.com/mashharuki/CDN/blob/main/packages/hardhat/test/Domains.test.ts)

I deployed DomainName Contract.

[0xD3095061512BCEA8E823063706BB9B15F75b187b](https://testnet.crossvaluescan.com/address/0xD3095061512BCEA8E823063706BB9B15F75b187b)

I registered new domain name in this transaction

[0x7924487669fa5af612ffd513f3f10ff6a572b92102bb9e0e0287470410c7f207](https://testnet.crossvaluescan.com/tx/0x7924487669fa5af612ffd513f3f10ff6a572b92102bb9e0e0287470410c7f207)

### Wave2

Update fronted

### Wave3

There are 3 update points.

- I Changed the contents of the Home Page to allow users to check and register domains from the Home Page.
- I Added filter function to the All Domains screen. You can now search only for domains that you own.
- I Added ability to update records on the All Domains screen. Allows you to set any record for any domain you own.

### Wave4

- SampleForwarder Contract

- Updated Domains Contract (NFT)

- DNS の所有に有効期限を付与(有効期限が過ぎたら自動的に burn)

  [Domains.sol に追加したロジック](https://github.com/mashharuki/CDN/blob/main/packages/hardhat/contracts/Domains.sol#L278-L334)

### Wave5

- 所有している DNS の一覧取得機能の追加

  [Domainx.xol に追加したロジック](https://github.com/mashharuki/CDN/blob/main/packages/hardhat/contracts/Domains.sol#L269-L273)

- Wave4 及び Wave5 でロジックを追加したスマートコントラクトをテストネットにデプロイ

  ```bash
  ===================================== [START] =====================================
  reusing "SampleForwarder" at 0xacff3BF500e0E9F7734D39064B290873d80Fe749
  reusing "NFTMarketplace" at 0xd18d0D5c3C8f915865069Fe11b25228a737E9925
  NFTMarketplace Contract is deployed: 0xd18d0D5c3C8f915865069Fe11b25228a737E9925
  reusing "Domains" at 0xCa2d4842FB28190D0b68A5F620232685A2436CDe
  Domains Contract is deployed: 0xCa2d4842FB28190D0b68A5F620232685A2436CDe
  ===================================== [set Domains address START] =====================================
  setDomainsAddress txn hash: 0x27b15f6cd15a94571c26b4c38594bf53c311658c7fa44dd3b7422527ea768aa1
  ===================================== [set Domains address END] =====================================
  ===================================== [END] =====================================
  ```

- ドメイン発行時の引数の数が変更されたのでそれに伴ってフロントエンド側を更新

  [更新した箇所](https://github.com/mashharuki/CDN/blob/main/packages/nextjs/app/cdn/_components/ServiceCard.tsx#L162-L168)

- NFT マーケットプレイスの画面を追加しました。

  [追加したコード]()

- スマートコントラクトのテストコードを更新しました。(NFT マーケットプレイスコントラクトと追加したロジック用のテストコードを追加しました。)

  [Domains.test.ts](https://github.com/mashharuki/CDN/blob/main/packages/hardhat/test/Domains.test.ts)

- ドメイン発行時に有効期限を指定できるようにフロントエンドを改修しました。

  [更新した箇所](https://github.com/mashharuki/CDN/blob/main/packages/nextjs/app/cdn/_components/ServiceCard.tsx#L266-L280)

### Wave6

- ドメインを発行した時に支払った NativeToken の半分を Relayer に送金するロジックを追加する。
- メタトランザクション機能をフロントエンド側に実装する。

### Wave7

- ドメインの有効期限が切れているかどうかチェックする機能をフロントエンド側から呼び出せるようにする。

### Wave8

### Wave9

### Wave10

## What's next for future Wave

- I will try to connect the DomainName contract to the front end.
- I will try to improve UI/UX.

## how to work

- setup

  ```bash
  yarn setup --network kura
  ```

- test

  ```bash
  yarn test
  ```

- deploy to kura

  ```bash
  yarn deploy --network kura
  ```

- register new domain

  ```bash
  yarn hardhat:register --name cdn --amount 0.001 --network kura
  ```

- check price of new domain name

  ```bash
  yarn hardhat:price --name test  --network kura
  ```

- set record data

  ```bash
  yarn hardhat:setRecord --name cdn --record sample --network kura
  ```

- withdraw from domains contract

  ```bash
  yarn hardhat:withdraw --network kura
  ```

- get tokenId's tokenURI

  ```bash
  yarn hardhat:getTokenURI --tokenid 0 --network kura
  ```

- check dmain name registered status

  ```bash
  yarn hardhat:checkRegistered --name cdn --network kura
  ```

- build Frontend

  ```bash
  yarn next:build
  ```

- start Frontend

  ```bash
  yarn start
  ```

### 参考文献

1. [テストネット BlockExplorer](https://testnet.crossvaluescan.com/)
2. [Hardhat CrossValueChain Docs](https://docs.crossvalue.io/testnet/how-to-deploy-to-smart-contracts-hardhat)
3. [GitHub - ensdomains/ens-contracts](https://github.com/ensdomains/ens-contracts/tree/staging)
4. [ENS Dapp](https://app.ens.domains/unsupportedNetwork)
5. [ENS Docs](https://docs.ens.domains/registry/eth)
6. [daisyui Docs](https://daisyui.com/docs/themes)
7. [daisyui Next.js Example](https://stackblitz.com/edit/daisyui-nextjs?file=app%2Fpage.jsx)
8. [GitHub - Central-Data-Hub](https://github.com/cardene777/Central-Data-Hub)
