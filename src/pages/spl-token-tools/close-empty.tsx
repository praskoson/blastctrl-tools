import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { SpinnerIcon, notify } from "components";
import { useOwnerAssets } from "lib/query/use-owner-assets";
import { cn, retryWithBackoff } from "lib/utils";
import { NextPage } from "next";
import Head from "next/head";
import { classNames } from "utils";
import { AccountList } from "components/close-empty/account-list";
import { PublicKey, Transaction } from "@solana/web3.js";
import {
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token-next";

const CloseEmpty: NextPage = () => {
  const { connection } = useConnection();
  const { connected, publicKey, sendTransaction } = useWallet();
  const { setVisible } = useWalletModal();
  const { data, isFetching, refetch } = useOwnerAssets(publicKey?.toString() || "");

  const handleLoad = async () => {
    if (!connected) {
      setVisible(true);
      return;
    }
    refetch();
  };

  const handleCreateAccounts = async () => {
    if (!publicKey || !sendTransaction) return;
    const tokens = [
      "jtojtomepa8beP8AuQc6eXt5FriJwfFMwQx2v2f9mCL",
      "C8yhZZpzz2rZ4XfGkikou7JksaL1UZj6DndZVudebno4",
      "WENWENvqqNya429ubCdR81ZmD69brwQaaBYY6p3LCpk",
      "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
      "4LLbsb5ReP3yEtYzmXewyGjcir5uXtKFURtaEUVC2AHs",
      "3psH1Mj1f7yUfaD5gh6Zj7epE8hhrMkMETgv5TshQA4o",
    ];

    const { value, context } = await retryWithBackoff(() =>
      connection.getLatestBlockhashAndContext({ commitment: "confirmed" }),
    );

    const tx = new Transaction().add(
      ...tokens.map((t) => createTokenAccount(new PublicKey(t), publicKey)),
    );
    (tx.recentBlockhash = value.blockhash), (tx.feePayer = publicKey);
    const signature = await sendTransaction(tx, connection, {
      preflightCommitment: "confirmed",
      skipPreflight: true,
      maxRetries: 0,
    });
    await connection.confirmTransaction({
      blockhash: value.blockhash,
      lastValidBlockHeight: value.lastValidBlockHeight,
      signature,
    });

    notify({ type: "success", title: "Transaction confirmed", txid: signature });
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

            <div className="flex flex-col items-center justify-center gap-2 pb-2 pt-8">
              <button
                type="button"
                onClick={handleLoad}
                disabled={isFetching}
                className={classNames(
                  "inline-flex w-[320px] items-center justify-center rounded-md bg-indigo-600 px-3 py-3 text-center text-base text-white",
                  "hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2",
                  "disabled:bg-indigo-700",
                )}
              >
                {buttonText()}
              </button>
              {process.env.NODE_ENV === "development" && (
                <button
                  className="block rounded-full bg-blue-600 px-3 py-1.5 text-white hover:bg-blue-500"
                  onClick={handleCreateAccounts}
                  type="button"
                >
                  Create token accounts
                </button>
              )}
            </div>
          </>
        )}

        {data && <AccountList tokenAccounts={data.filter((a) => a.balance === 0n)} />}
      </div>
    </>
  );
};

export default CloseEmpty;

const createTokenAccount = (token: PublicKey, wallet: PublicKey) => {
  return createAssociatedTokenAccountInstruction(
    wallet,
    getAssociatedTokenAddressSync(token, wallet),
    wallet,
    token,
  );
};
