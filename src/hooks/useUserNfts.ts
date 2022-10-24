import { Connection, PublicKey } from "@solana/web3.js";
import { Metaplex, Cluster, guestIdentity } from "@metaplex-foundation/js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import useSWR from "swr";
import { useEffect, useMemo } from "react";
import { useNetworkConfigurationStore } from "stores/useNetworkConfiguration";

const fetchWalletNfts = (connection: Connection, cluster: Cluster) => async (wallet58: string) => {
  let wallet: PublicKey;
  try {
    wallet = new PublicKey(wallet58);
  } catch (err) {
    throw Error(`Invalid wallet pubkey: ${wallet58}`, {
      cause: err as Error,
    });
  }

  const metaplex = Metaplex.make(connection, { cluster }).use(guestIdentity());

  // Can be NFT | SFT | "token with metadata"
  return await metaplex.nfts().findAllByOwner({ owner: wallet, commitment: "confirmed" }).run();
};

export const useUserNfts = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const { network } = useNetworkConfigurationStore();

  const fetcher = useMemo(() => fetchWalletNfts(connection, network), [connection, network]);

  const { data, error, mutate } = useSWR(() => publicKey?.toBase58(), fetcher, {
    refreshInterval: 60000,
    errorRetryCount: 5,
    errorRetryInterval: 10000,
  });

  useEffect(() => {
    mutate();
  }, [network, mutate]);

  return { isError: error, isLoading: !error && !data, nfts: data };
};
