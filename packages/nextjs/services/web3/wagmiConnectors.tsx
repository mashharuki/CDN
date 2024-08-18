import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  coinbaseWallet,
  ledgerWallet,
  metaMaskWallet,
  rainbowWallet,
  safeWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { rainbowkitBurnerWallet } from "burner-connector";
import { intmaxwalletsdk } from "intmax-walletsdk/rainbowkit";
import * as chains from "viem/chains";
import scaffoldConfig from "~~/scaffold.config";

const { onlyLocalBurnerWallet, targetNetworks } = scaffoldConfig;

const additionalWallets = [
  intmaxwalletsdk({
    wallet: {
      url: "https://intmaxwallet-sdk-wallet.vercel.app/",
      name: "IntmaxWalletSDK Demo",
      iconUrl: "https://intmaxwallet-sdk-wallet.vercel.app/vite.svg",
    },
    metadata: {
      name: "Rainbow-Kit Demo",
      description: "Rainbow-Kit Demo",
      icons: ["https://intmaxwallet-sdk-wallet.vercel.app/vite.svg"],
    },
  }),
  intmaxwalletsdk({
    mode: "iframe",
    wallet: {
      url: "https://intmaxwallet-sdk-wallet.vercel.app/",
      name: "IntmaxWalletSDK Demo",
      iconUrl: "https://intmaxwallet-sdk-wallet.vercel.app/vite.svg",
    },
    metadata: {
      name: "Rainbow-Kit Demo",
      description: "Rainbow-Kit Demo",
      icons: ["https://intmaxwallet-sdk-wallet.vercel.app/vite.svg"],
    },
  }),
  intmaxwalletsdk({
    wallet: {
      url: "https://wallet.intmax.io",
      name: "INTMAX Wallet",
      iconUrl: "https://wallet.intmax.io/favicon.ico",
    },
    metadata: {
      name: "Rainbow-Kit Demo",
      description: "Rainbow-Kit Demo",
      icons: ["https://intmaxwallet-sdk-wallet.vercel.app/vite.svg"],
    },
  }),
];

const wallets = [
  metaMaskWallet,
  walletConnectWallet,
  ledgerWallet,
  coinbaseWallet,
  rainbowWallet,
  safeWallet,
  ...(!targetNetworks.some(network => network.id !== (chains.hardhat as chains.Chain).id) || !onlyLocalBurnerWallet
    ? [rainbowkitBurnerWallet]
    : []),
];

/**
 * wagmi connectors for the wagmi context
 */
export const wagmiConnectors = connectorsForWallets(
  [
    {
      groupName: "Supported Wallets",
      wallets,
    },
    {
      groupName: "IntmaxWallet",
      wallets: additionalWallets,
    },
  ],

  {
    appName: "scaffold-eth-2",
    projectId: scaffoldConfig.walletConnectProjectId,
  },
);
