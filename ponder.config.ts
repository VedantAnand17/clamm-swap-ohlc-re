import { createConfig } from "ponder";
import { http } from "viem";
import { UniswapV3PoolABI } from "./abis/UniswapV3PoolABI";

export default createConfig({
  networks: {
    base: {
      chainId: 8453,
      transport: http(process.env.PONDER_RPC_URL_8453),
      maxRequestsPerSecond: 300,
    },
  },
  contracts: {
    UniswapV3Pool: {
      network: "base",
      address: ["0xd0b53D9277642d899DF5C87A3966A349A798F224"],
      startBlock: 21620977,
      abi: UniswapV3PoolABI,
    },
  },
});
