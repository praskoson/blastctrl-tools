import { RawAccount } from "@solana/spl-token-next";
import { PublicKey } from "@solana/web3.js";

export type EndpointTypes = "mainnet" | "devnet" | "testnet" | "localnet";

export type AccountInfo = {
  address: PublicKey;
  data: RawAccount;
  executable: boolean;
  owner: PublicKey;
  lamports: number;
  rentEpoch?: number;
};
