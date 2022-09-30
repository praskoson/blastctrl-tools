import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useNetworkConfiguration } from 'contexts/NetworkConfigurationProvider';
import { NextPage } from 'next';
import Head from 'next/head';
import { useMemo } from 'react';
import { BundlrStorageDriver } from 'utils/bundlr-storage';
import { UploaderView } from 'views';

const Arweave: NextPage = (props) => {
  const { connection } = useConnection();
  const { networkConfiguration } = useNetworkConfiguration();
  const wallet = useWallet();

  const storage = useMemo(
    () =>
      new BundlrStorageDriver(connection, wallet, {
        priceMultiplier: 1.5,
        timeout: 60000,
        providerUrl: connection.rpcEndpoint,
        identity: wallet,
        address:
          networkConfiguration === 'mainnet-beta'
            ? 'https://node1.bundlr.network'
            : 'https://devnet.bundlr.network',
      }),
    [connection, wallet]
  );

  return (
    <div>
      <Head>
        <title>BlastCtrl Tools - Arweave</title>
        <meta name='Metaplex Collections' content='Basic Functionality' />
      </Head>
      <UploaderView storage={storage} />
    </div>
  );
};

export default Arweave;
