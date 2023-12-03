import {
  WalletConnectionError,
  WalletDisconnectedError,
  WalletError,
  WalletNotConnectedError,
  WalletSendTransactionError,
  WalletSignMessageError,
  WalletSignTransactionError,
} from "@solana/wallet-adapter-base";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { FC, ReactNode, useCallback, useMemo } from "react";
import { AutoConnectProvider, useAutoConnect } from "./AutoConnectProvider";
import { mergeClusterApiUrl } from "utils/spl/common";
import { useNetworkConfigurationStore } from "stores/useNetworkConfiguration";
import { notify } from "components";
import { SolflareWalletAdapter, LedgerWalletAdapter } from "@solana/wallet-adapter-wallets";
import dynamic from "next/dynamic";

const DynamicReactUiWalletModalProvider = dynamic(
  () => import("@solana/wallet-adapter-react-ui").then((box) => box.WalletModalProvider),
  { ssr: false }
);

const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { autoConnect } = useAutoConnect();
  const { network } = useNetworkConfigurationStore();
  const endpoint = useMemo(() => mergeClusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [
      /**
       * Wallets that implement either of these standards will be available automatically.
       *
       *   - Solana Mobile Stack Mobile Wallet Adapter Protocol
       *     (https://github.com/solana-mobile/mobile-wallet-adapter)
       *   - Solana Wallet Standard
       *     (https://github.com/solana-labs/wallet-standard)
       *
       * If you wish to support a wallet that supports neither of those standards,
       * instantiate its legacy wallet adapter here. Common legacy adapters can be found
       * in the npm package `@solana/wallet-adapter-wallets`.
       */
      new SolflareWalletAdapter(),
      new LedgerWalletAdapter(),
    ],
    []
  );

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
