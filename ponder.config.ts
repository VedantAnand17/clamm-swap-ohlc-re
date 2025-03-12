import { createConfig } from "ponder";
import { http } from "viem";
import { UniswapV3PoolABI } from "./abis/UniswapV3PoolABI";

export default createConfig({
  networks: {
    tenderly: {
      chainId: 8450,
      transport: http(process.env.PONDER_RPC_URL_8450),
    },
  },
  contracts: {
    UniswapV3Pool: {
      network: "tenderly",
      address: ["0xd0b53D9277642d899DF5C87A3966A349A798F224"],
      startBlock: 21495365,
      abi: UniswapV3PoolABI,
    },
  },
});
