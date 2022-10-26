import {
  WalletAdapterNetwork,
  WalletError,
  WalletSendTransactionError,
} from "@solana/wallet-adapter-base";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider as ReactUIWalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  SolletWalletAdapter,
  GlowWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { LedgerWalletAdapter } from "@solana/wallet-adapter-ledger";
import { FC, ReactNode, useCallback, useMemo } from "react";
import { AutoConnectProvider, useAutoConnect } from "./AutoConnectProvider";
import { mergeClusterApiUrl } from "utils/spl/common";
import { useNetworkConfigurationStore } from "stores/useNetworkConfiguration";
import { notify } from "components/Notification";

const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { autoConnect } = useAutoConnect();
  const { network } = useNetworkConfigurationStore();
  // const { networkConfiguration } = useNetworkConfiguration();
  // endpo
  // const endpoint = useMemo(() => mergeClusterApiUrl(networkConfiguration), [networkConfiguration]);
  const endpoint = useMemo(() => mergeClusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new SolletWalletAdapter(),
      new GlowWalletAdapter(),
      new LedgerWalletAdapter(),
      // new SlopeWalletAdapter(),
    ],
    []
  );

  const onError = useCallback((error: WalletError) => {
    if (error instanceof WalletSendTransactionError) {
      // The caller should be handling this
      return;
    }
    notify({
      type: "error",
      title: error.name,
      description: error.message ? error.message : error.name,
    });
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} onError={onError} autoConnect={autoConnect}>
        <ReactUIWalletModalProvider>{children}</ReactUIWalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export const ContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <>
      {/* <NetworkConfigurationProvider> */}
      <AutoConnectProvider>
        <WalletContextProvider>{children}</WalletContextProvider>
      </AutoConnectProvider>
      {/* </NetworkConfigurationProvider> */}
    </>
  );
};
