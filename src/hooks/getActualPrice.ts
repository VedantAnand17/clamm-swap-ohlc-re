import { Price, Token } from '@uniswap/sdk-core';
import { POOL_CONFIGS } from "../../poolConfig";

/**
 * Converts Uniswap V3's sqrtPriceX96 to actual USD price using Uniswap SDK
 * @param poolAddress The address of the Uniswap V3 pool
 * @param sqrtPriceX96 The sqrtPriceX96 value from the pool
 * @returns The price in USD terms
 */
export function getActualPrice(poolAddress: string, sqrtPriceX96: bigint): number {
  const poolConfig = POOL_CONFIGS[poolAddress.toLowerCase()];
  
  if (!poolConfig) {
    throw new Error(`Pool config not found for address ${poolAddress}`);
  }

  // Create token instances
  const token0 = new Token(
    poolConfig.chainId, // Arbitrum chain ID
    poolConfig.token0.address, // Using pool address as token address for now
    poolConfig.token0.decimals,
    poolConfig.token0.symbol
  );

  const token1 = new Token(
    poolConfig.chainId,
    poolConfig.token1.address,
    poolConfig.token1.decimals,
    poolConfig.token1.symbol
  );

  // Calculate price using sqrtPriceX96
  const price = new Price(
    token0,
    token1,
    String(1n << 192n), // Convert to string for BigintIsh type
    String(sqrtPriceX96 * sqrtPriceX96)
  );

  // If token1 is the volatile token (e.g. WETH in USDC/WETH),
  // then we need to take the inverse of the price
  if (poolConfig.isToken1Volatile) {
    return 1 / Number(price.toFixed(8));
  }

  // If token1 is the stable token (e.g. USDC in WETH/USDC),
  // then return the price as is
  return Number(price.toFixed(8));
}