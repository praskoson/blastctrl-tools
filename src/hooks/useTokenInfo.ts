import { useConnection } from "@solana/wallet-adapter-react";
import { Connection, PublicKey } from "@solana/web3.js";
import useSWR from "swr";
import { getMetadata } from "utils/spl";
import { Metadata } from "@metaplex-foundation/mpl-token-metadata";

export type MaybeTokenWithMetadata =
  | (Metadata & { readonly exists: true })
  | { readonly mint: PublicKey; readonly exists: false };

const fetcher = async (connection: Connection, mint: PublicKey) => {
  const [_info, metadataInfo] = await connection.getMultipleAccountsInfo([mint, getMetadata(mint)]);

  // if (!metadataInfo) {
  //   return { exists: false, mint };
  // }

  return Metadata.fromAccountInfo(metadataInfo)[0];
};

export type TokenData = Awaited<ReturnType<typeof fetcher>>;

export const useTokenInfo = (mint?: PublicKey) => {
  const { connection } = useConnection();
  const { data, error } = useSWR<TokenData, Error>(
    mint?.toBase58(),
    () => fetcher(connection, mint),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnMount: false,
    }
  );

  return { mintInfo: data, error };
};
