import { Cluster, clusterApiUrl } from "@solana/web3.js";

const envRpc = process.env.NEXT_PUBLIC_RPC_ENDPOINT ?? clusterApiUrl("mainnet-beta");

export const Networks: { [key in Cluster]: string } = {
  "mainnet-beta": process.env.NEXT_PUBLIC_RPC_ENDPOINT ?? clusterApiUrl("mainnet-beta"),
  testnet: clusterApiUrl("testnet"),
  devnet: clusterApiUrl("devnet"),
};
