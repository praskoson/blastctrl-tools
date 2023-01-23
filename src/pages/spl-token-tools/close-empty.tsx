import { Account, TOKEN_PROGRAM_ID, unpackAccount } from "@solana/spl-token-next";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { SpinnerIcon, notify } from "components";
import { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { classNames } from "utils";
import { AccountList } from "views/empty-accounts/account-list";

const CloseEmpty: NextPage = () => {
  const { connection } = useConnection();
  const { connected, publicKey } = useWallet();
  const { setVisible } = useWalletModal();
  const [isLoading, setIsLoading] = useState(false);
  const [accounts, setAccounts] = useState<Account[] | null>(null);

  const handleLoad = async () => {
    if (!connected) {
      setVisible(true);
      return;
    }
    setIsLoading(true);
    try {
      const result = await connection.getTokenAccountsByOwner(publicKey, {
        programId: TOKEN_PROGRAM_ID,
      });
      const accounts = result.value.map(({ pubkey, account }) => ({
        ...unpackAccount(pubkey, account),
      }));
      setAccounts(accounts.filter(({ amount }) => amount.toString() === "0"));
    } catch (err) {
      notify({ type: "error", title: "Error loading token accounts", description: err?.message });
    } finally {
      setIsLoading(false);
    }
  };

  const buttonText = () => {
    if (!connected) return "Connect your wallet";
    if (isLoading)
      return (
        <>
          <SpinnerIcon className="-ml-1 mr-2 h-5 w-5 animate-spin" />
          Loading
        </>
      );

    return "Load token accounts";
  };

  return (
    <>
      <Head>
        <title>Tools | Blast Ctrl - Close Empty Accounts</title>
        <meta name="Close Token Accounts" content="Recover SOL by closing empty token accounts." />
      </Head>
      <div className="mx-auto max-w-xl overflow-visible bg-white px-4 pb-5 sm:mb-6 sm:rounded-lg sm:p-6 sm:shadow">
        <h1 className="mb-4 font-display text-3xl font-semibold">Close Empty Token Accounts</h1>
        <p className="text-sm text-gray-500">
          List all empty token accounts in your wallet. You can use this tool to close those
          accounts, recovering the SOL used to create them. Each token account can recover{" "}
          <code className="text-sm">
            <span className="mr-1 text-lg leading-tight">◎</span>0.0020342
          </code>
          .
        </p>
        {accounts?.length > 0 ? (
          <AccountList accounts={accounts} />
        ) : (
          <div className="flex items-center justify-center py-4">
            <button
              type="button"
              onClick={handleLoad}
              disabled={isLoading}
              className={classNames(
                "inline-flex items-center rounded-md bg-indigo-600 px-3 py-1.5 text-base text-white",
                "hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2",
                "disabled:bg-indigo-700"
              )}
            >
              {buttonText()}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CloseEmpty;
