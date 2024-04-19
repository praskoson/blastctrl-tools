import {
  WalletConnectionError,
  WalletDisconnectedError,
  WalletError,
  WalletNotConnectedError,
  WalletSendTransactionError,
  WalletSignMessageError,
  WalletSignTransactionError,
} from "@solana/wallet-adapter-base";
import { LedgerWalletAdapter } from "@solana/wallet-adapter-ledger";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { notify } from "components";
import dynamic from "next/dynamic";
import { FC, ReactNode, useCallback, useMemo } from "react";
import { useNetworkConfigurationStore } from "stores/useNetworkConfiguration";
import { mergeClusterApiUrl } from "utils/spl/common";
import { AutoConnectProvider, useAutoConnect } from "./AutoConnectProvider";

const DynamicReactUiWalletModalProvider = dynamic(
  () => import("@solana/wallet-adapter-react-ui").then((box) => box.WalletModalProvider),
  { ssr: false },
);

const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { autoConnect } = useAutoConnect();
  const { network } = useNetworkConfigurationStore();
  const endpoint = useMemo(() => mergeClusterApiUrl(network), [network]);

  const wallets = useMemo(() => [new LedgerWalletAdapter()], []);

  const onError = useCallback((error: WalletError) => {
    if (
      error instanceof WalletSendTransactionError ||
      error instanceof WalletSignTransactionError ||
      error instanceof WalletSignMessageError
    ) {
      // The caller should be handling this
      return;
    }

    if (
      error instanceof WalletNotConnectedError ||
      error instanceof WalletDisconnectedError ||
      error instanceof WalletConnectionError ||
      error instanceof WalletNotConnectedError
    ) {
      // Ignore
      notify({ type: "info", title: "Wallet Error", description: "Connect your Solana wallet." });
      return;
    }
    throw error;
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} onError={onError} autoConnect={autoConnect}>
        <DynamicReactUiWalletModalProvider>{children}</DynamicReactUiWalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export const ContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <AutoConnectProvider>
      <WalletContextProvider>{children}</WalletContextProvider>
    </AutoConnectProvider>
  );
};
