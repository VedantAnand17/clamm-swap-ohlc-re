export interface PoolConfig {
  address: string;
  chainId: number;
  isToken1Volatile: boolean;
  token0: {
    address: string;
    decimals: number;
    symbol: string;
  };
  token1: {
    address: string;
    decimals: number;
    symbol: string;
  };
}

export const POOL_CONFIGS: Record<string, PoolConfig> = {
  "0xd0b53d9277642d899df5c87a3966a349a798f224": {
    address: "0xd0b53d9277642d899df5c87a3966a349a798f224",
    chainId: 8453, // Arbitrum One
    isToken1Volatile: false, // is WETH token1?
    token0: {
      address: "0x4200000000000000000000000000000000000006", // WETH on Arbitrum
      decimals: 18,
      symbol: "WETH",
    },
    token1: {
      address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // USDC on Arbitrum
      decimals: 6,
      symbol: "USDC",
    },
  },
  // Add other pools...
};
