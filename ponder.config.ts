import { createConfig } from "ponder";
import { http } from "viem";
import { UniswapV3PoolABI } from "./abis/UniswapV3PoolABI";

export default createConfig({
  networks: {
    monad: {
      chainId: 10143,
      transport: http(process.env.PONDER_RPC_URL_10143),
      maxRequestsPerSecond: 300,
    },
  },
  contracts: {
    UniswapV3Pool: {
      network: "monad",
      address: ["0x60a336798063396d8f0f398411bad02a762735c4"],
      startBlock: 26561045,
      abi: UniswapV3PoolABI,
    },
  },
});
