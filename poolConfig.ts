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
  "0x60a336798063396d8f0f398411bad02a762735c4": {
    address: "0x60a336798063396d8f0f398411bad02a762735c4",
    chainId: 10143, // Monad
    isToken1Volatile: false, // is WBTC token1?
    token0: {
      address: "0xcf5a6076cfa32686c0df13abada2b40dec133f1d", // WBTC on Monad
      decimals: 8,
      symbol: "WBTC",
    },
    token1: {
      address: "0xf817257fed379853cde0fa4f97ab987181b1e5ea", // USDC on Arbitrum
      decimals: 6,
      symbol: "USDC",
    },
  },
  // Add other pools...
};
