import { useWallet } from "@solana/wallet-adapter-react";
import { IrysStorage } from "lib/irys";
import { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useNetworkConfigurationStore } from "stores/useNetworkConfiguration";
import { UploaderView } from "views";

const FileUpload: NextPage = () => {
  const { network } = useNetworkConfigurationStore();
  const wallet = useWallet();
  const [storage, setStorage] = useState<IrysStorage | null>(null);

  useEffect(() => {
    async function makeWebIrys() {
      const irys = await IrysStorage.makeWebIrys(network, wallet);
      setStorage(irys);
    }
    if (!storage && wallet && wallet?.connected) {
      makeWebIrys();
    }

    () => {
      setStorage(null);
    };
  }, [network, storage, wallet, wallet.connected]);

  return (
    <div>
      <Head>
        <title>Tools | BlastTools - File upload</title>
        <meta name="Metaplex Collections" content="Basic Functionality" />
      </Head>
      <div className="mx-auto">
        <div className="mb-4 sm:border-b sm:border-gray-200 sm:pb-3">
          <h1 className="mb-2 text-center font-display text-3xl font-semibold text-gray-900">
            Simple Arweave Uploader
          </h1>
          <p className="text-center text-sm leading-snug tracking-tight text-gray-900">
            Upload files to Arweave using the Bundlr Network and paying in SOL.
          </p>
        </div>
      </div>
      {wallet && storage ? (
        <UploaderView irys={storage} />
      ) : (
        <div>Connect your wallet to use this tool</div>
      )}
    </div>
  );
};

export default FileUpload;
