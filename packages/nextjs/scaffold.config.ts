import * as chains from "viem/chains";

export type ScaffoldConfig = {
  targetNetworks: readonly chains.Chain[];
  pollingInterval: number;
  alchemyApiKey: string;
  walletConnectProjectId: string;
  onlyLocalBurnerWallet: boolean;
};

/**
 * Xenea testnet config
 */
export const xeneaTestnet: chains.Chain = {
  id: 5555,
  name: "Xenea Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "XCR",
    symbol: "XCR",
  },
  rpcUrls: {
    default: { http: ["https://rpc-kura.cross.technology"] },
  },
  blockExplorers: {
    default: {
      name: "XeneaScan",
      url: "https://testnet.crossvaluescan.com/",
    },
  },
};

chains.arbitrum;

const scaffoldConfig = {
  // The networks on which your DApp is live
  targetNetworks: [xeneaTestnet],
  pollingInterval: 30000,
  alchemyApiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY!,
  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,

  // Only show the Burner Wallet when running on hardhat network
  onlyLocalBurnerWallet: true,
} as const satisfies ScaffoldConfig;

export default scaffoldConfig;
