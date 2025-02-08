import { createConfig } from "ponder";
import { http } from "viem";
import { UniswapV3PoolABI } from "./abis/UniswapV3PoolABI";

export default createConfig({
  networks: {
    arbitrum: {
      chainId: 42161,
      transport: http(process.env.PONDER_RPC_URL_42161),
    },
  },
  contracts: {
    UniswapV3Pool: {
      network: "arbitrum",
      address: ["0xC6962004f452bE9203591991D15f6b388e09E8D0"],
      startBlock: 188249317,
      endBlock: 189999317,
      abi: UniswapV3PoolABI,
    },
  },
});
