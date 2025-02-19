export interface PoolConfig {
    address: string;
    isToken1Volatile: boolean;
    token0: {
      decimals: number;
      symbol: string;
    };
    token1: {
      decimals: number;
      symbol: string;
    };
  }
  
  export const POOL_CONFIGS: Record<string, PoolConfig> = {
    "0xc6962004f452be9203591991d15f6b388e09e8d0": {
      address: "0xc6962004f452be9203591991d15f6b388e09e8d0",
      isToken1Volatile: false, // is WETH token1?
      token0: {
        decimals: 18,
        symbol: "WETH"
      },
      token1: {
        decimals: 6,
        symbol: "USDC"
      }
    },
    // Add other pools...
  };