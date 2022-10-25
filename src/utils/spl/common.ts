import { clusterApiUrl, PublicKey } from "@solana/web3.js";
import { assert } from "../../utils";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

export const PROGRAM_ADDRESS = "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s";
export const METADATA_PROGRAM_ID = new PublicKey(PROGRAM_ADDRESS);

export const getMasterEdition = (mint: PublicKey): PublicKey => {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from("metadata"),
      METADATA_PROGRAM_ID.toBuffer(),
      mint.toBuffer(),
      Buffer.from("edition"),
    ],
    METADATA_PROGRAM_ID
  )[0];
};

export const getMetadata = (mint: PublicKey): PublicKey => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("metadata"), METADATA_PROGRAM_ID.toBuffer(), mint.toBuffer()],
    METADATA_PROGRAM_ID
  )[0];
};

export const mergeClusterApiUrl = (network: WalletAdapterNetwork) => {
  return network === WalletAdapterNetwork.Mainnet
    ? "https://radial-few-vineyard.solana-mainnet.discover.quiknode.pro/f4ee50b169a4ed2711b60b47cd20548787e555af/"
    : clusterApiUrl(network);
};

export function isPublicKey(value: any) {
  try {
    new PublicKey(value);
    return true;
  } catch {
    return false;
  }
}

export function assertPublicKey(value: any): asserts value is PublicKey {
  assert(isPublicKey(value), "Not valid public key");
}

export function compress(str: string, chars: number) {
  return str.slice(0, chars) + "..." + str.slice(-chars);
}
