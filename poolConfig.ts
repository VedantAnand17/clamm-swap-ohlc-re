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
  "0xe8781dc41a694c6877449cefb27cc2c0ae9d5dbc": {
    address: "0xe8781Dc41A694c6877449CEFB27cc2C0Ae9D5dbc",
    chainId: 10143, // Monad
    isToken1Volatile: false, // is WBTC token1?
    token0: {
      address: "0xb5a30b0fdc5ea94a52fdc42e3e9760cb8449fb37", // WETH on Monad
      decimals: 18,
      symbol: "WETH",
    },
    token1: {
      address: "0xf817257fed379853cde0fa4f97ab987181b1e5ea", // USDC on Monad
      decimals: 6,
      symbol: "USDC",
    },
  },
  // Add other pools...
};
