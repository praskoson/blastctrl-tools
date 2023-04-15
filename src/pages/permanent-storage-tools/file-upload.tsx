import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { NextPage } from "next";
import Head from "next/head";
import { useMemo } from "react";
import { useNetworkConfigurationStore } from "stores/useNetworkConfiguration";
import { BundlrStorageDriver } from "utils/bundlr-storage";
import { UploaderView } from "views";

const FileUpload: NextPage = () => {
  const { connection } = useConnection();
  const { network } = useNetworkConfigurationStore();
  const wallet = useWallet();

  const storage = useMemo(
    () =>
      new BundlrStorageDriver(connection, wallet, {
        priceMultiplier: 1.5,
        timeout: 60000,
        providerUrl: connection.rpcEndpoint,
        identity: wallet,
        address:
          network === WalletAdapterNetwork.Mainnet
            ? "https://node1.bundlr.network"
            : "https://devnet.bundlr.network",
      }),
    [connection, wallet, network]
  );

  return (
    <div>
      <Head>
        <title>Tools | Blast Ctrl - File upload</title>
        <meta name="Metaplex Collections" content="Basic Functionality" />
      </Head>
      <UploaderView storage={storage} />
    </div>
  );
};

export default FileUpload;
