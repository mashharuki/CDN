# 🏗 CrossValueChain Domain Name Service (CDN)

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

### Wave3

### Wave4

### Wave5

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
