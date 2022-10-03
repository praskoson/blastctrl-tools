import { Connection, PublicKey } from '@solana/web3.js';
import { Metaplex, Cluster, guestIdentity } from '@metaplex-foundation/js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import useSWR from 'swr';
import { useNetworkConfiguration } from 'contexts/NetworkConfigurationProvider';

const fetchWalletNfts =
  (connection: Connection, cluster: Cluster) => async (wallet58: string) => {
    let wallet: PublicKey;
    try {
      wallet = new PublicKey(wallet58);
    } catch (err) {
      throw Error(`Invalid wallet pubkey: ${wallet58}`, {
        cause: err as Error,
      });
    }

    const metaplex = Metaplex.make(connection, { cluster }).use(
      guestIdentity()
    );
    
    // Can be NFT | SFT | "token with metadata"
    return await metaplex
      .nfts()
      .findAllByOwner({ owner: wallet, commitment: 'confirmed' })
      .run();
  };

export const useUserNfts = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const { networkConfiguration } = useNetworkConfiguration();

  const fetcher = fetchWalletNfts(connection, networkConfiguration);

  const { data, error } = useSWR(() => publicKey?.toBase58(), fetcher, {
    refreshInterval: 60000,
  });

  return { isError: error, isLoading: !error && !data, nfts: data };
};
