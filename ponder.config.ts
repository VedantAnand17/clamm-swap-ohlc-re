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
      address: ["0xe8781Dc41A694c6877449CEFB27cc2C0Ae9D5dbc"],
      startBlock: 30758249,
      abi: UniswapV3PoolABI,
    },
  },
});
