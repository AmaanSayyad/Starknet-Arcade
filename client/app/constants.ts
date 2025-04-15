import { Contract, RpcProvider } from "starknet";
import { CoinFlipABI } from "./abi";
export const RPS_CONTRACT_ADDRESS =
  "0x0716703cdb41f2ac101fe58b67ee846da8118d2d700c6fa5e7de7dd8d2e60adb";
export const COIN_FLIP_ADDRESS =
  "0x032ee3f9b4263aae8fe9547b6bd3aaf45efe2806b9cf41f266028c743857edd3";
export const ETH_TOKEN_ADDRESS =
  "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";
export const STRK_TOKEN_ADDRESS =
  "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d";

export const SNAKE_N_LADDERS_ADDRESS =
  "0x0686f21556c4e995e61e1bf02f10155207f8921dceffe88d9bb794e4c66ee26c";

export const ROULETTE_ADDRESS="0x049803290139f4df889213777b39389034db37e948fd22f91b4b37360c8caf92";
export const voyagerScanBaseUrl = "https://sepolia.voyager.online";

export const provider = new RpcProvider({
  nodeUrl: "https://starknet-sepolia.public.blastapi.io",
});

export const coin_flip_contract = new Contract(
  CoinFlipABI,
  COIN_FLIP_ADDRESS,
  provider
).typedv2(CoinFlipABI);
