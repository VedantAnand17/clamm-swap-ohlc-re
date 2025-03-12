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
    "0xc6962004f452be9203591991d15f6b388e09e8d0": {
      address: "0xc6962004f452be9203591991d15f6b388e09e8d0",
      chainId: 42161, // Arbitrum One
      isToken1Volatile: false, // is WETH token1?
      token0: {
        address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1", // WETH on Arbitrum
        decimals: 18,
        symbol: "WETH"
      },
      token1: {
        address: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8", // USDC on Arbitrum
        decimals: 6,
        symbol: "USDC"
      }
    },
    // Add other pools...
  };