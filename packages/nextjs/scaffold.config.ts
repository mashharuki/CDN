import * as chains from "viem/chains";

export type ScaffoldConfig = {
  targetNetworks: readonly chains.Chain[];
  pollingInterval: number;
  alchemyApiKey: string;
  walletConnectProjectId: string;
  onlyLocalBurnerWallet: boolean;
};

/**
 * CrossValueChain testnet config
 */
export const crossValueChainTestnet = {
  id: 5555,
  name: "CrossValueChainTestnet",
  nativeCurrency: {
    decimals: 18,
    name: "XCR",
    symbol: "XCR",
  },
  rpcUrls: {
    default: { http: ["https://rpc-kura.cross.technology"] },
  },
};

const scaffoldConfig = {
  // The networks on which your DApp is live
  targetNetworks: [crossValueChainTestnet],
  pollingInterval: 30000,
  alchemyApiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY!,
  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,

  // Only show the Burner Wallet when running on hardhat network
  onlyLocalBurnerWallet: true,
} as const satisfies ScaffoldConfig;

export default scaffoldConfig;
