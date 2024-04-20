import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { SpinnerIcon, notify } from "components";
import { useOwnerAssets } from "lib/query/use-owner-assets";
import { cn, iife } from "lib/utils";
import { NextPage } from "next";
import Head from "next/head";
import { classNames } from "utils";
import { AccountList } from "components/close-empty/account-list";

const CloseEmpty: NextPage = () => {
  const { connected, publicKey } = useWallet();
  const { setVisible } = useWalletModal();
  const { data, isFetching, refetch } = useOwnerAssets(publicKey?.toString() || "");

  const handleLoad = async () => {
    if (!connected) {
      setVisible(true);
      return;
    }
    refetch();
  };

  const buttonText = () => {
    if (!connected) return "Connect your wallet";
    if (isFetching)
      return (
        <>
          <SpinnerIcon className="-ml-1 mr-2 size-5 animate-spin" />
          Loading
        </>
      );

    return "I understand, show my token accounts";
  };

  return (
    <>
      <Head>
        <title>BlastTools - Close Empty Accounts</title>
        <meta name="Close Token Accounts" content="Recover SOL by closing empty token accounts." />
      </Head>
      <div
        className={cn(
          "mx-auto w-full max-w-3xl overflow-visible bg-white px-4 pb-5 sm:rounded-lg sm:p-6 sm:shadow",
          !!data && "!pb-0",
        )}
      >
        <h1 className="mb-4 font-display text-3xl font-semibold">Close Empty Token Accounts</h1>
        {!data && (
          <>
            <div className="space-y-2 text-gray-500">
              <p className="text-pretty">
                You can use this tool to list empty token accounts in your wallet and close them, to
                recover SOL that was used to create them. Some token accounts (frozen) cannot be
                closed, so those won&apos;t be displayed.
              </p>
              <p className="text-balance">
                While token accounts can be recreated after you close them, this is still a
                destructive action and could have unexpected consequences, so you should be aware of
                that before proceeding.
              </p>
              <p>Each token account can recover 0.0020342 SOL.</p>
            </div>

            <div className="flex items-center justify-center pt-8 pb-2">
              <button
                type="button"
                onClick={handleLoad}
                disabled={isFetching}
                className={classNames(
                  "inline-flex items-center justify-center text-center rounded-md bg-indigo-600 px-3 py-3 text-base text-white w-[320px]",
                  "hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2",
                  "disabled:bg-indigo-700",
                )}
              >
                {buttonText()}
              </button>
            </div>
          </>
        )}

        {data && (
          <AccountList
            tokenAccounts={data.result.items.filter((item) => item.token_info.balance === 0)}
          />
        )}
      </div>
    </>
  );
};

export default CloseEmpty;
