import { ArrowPathIcon } from "@heroicons/react/20/solid";
import { parseTokenAccount } from "@metaplex-foundation/js";
import { Account, AccountLayout, TOKEN_PROGRAM_ID, unpackAccount } from "@solana/spl-token-next";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useCallback, useState } from "react";
import { classNames } from "utils";
import { isATA } from "utils/spl/common";
import { findNestedAta } from "utils/spl/nested-ata";
import { NestedList } from "./nested-list";

//////////////////////////////
// 0: not active
// 1: started to search
// 2: found user wallet ATA
// 3: found all nested ATA
//////////////////////////////
export type LoadingSteps = 0 | 1 | 2 | 3;

export const AutomaticRecover = () => {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();
  const [step, setStep] = useState<LoadingSteps>(0);
  const [progress, setProgress] = useState<number>(0);

  const [walletAccounts, setWalletAccounts] = useState<Account[] | null>(null);
  const [nestedPairs, setNestedPairs] = useState<Awaited<ReturnType<typeof findNestedAta>>>(null);

  const width = `${Math.max(1, (step - 1) * 50 + progress * 50).toFixed(0)}%`;
  const isSearching = step === 1 || step === 2;

  const query = useCallback(async () => {
    if (!connected) {
      throw new WalletNotConnectedError("Connect your wallet");
    }
    // Reset
    setStep(0);
    setWalletAccounts(null);
    setProgress(0);

    setStep(1);
    const walletATAs = (
      await connection.getTokenAccountsByOwner(
        publicKey,
        { programId: TOKEN_PROGRAM_ID },
        { commitment: "confirmed" }
      )
    ).value
      .map(({ pubkey, account }) => unpackAccount(pubkey, account))
      .filter(({ address, mint }) => isATA({ address, mint, owner: publicKey }));

    setWalletAccounts(walletATAs);
    setStep(2);
    // Step 1: We're done loading the wallet ATAs

    const nested = await findNestedAta({
      connection,
      walletAccounts: walletATAs,
      onProgress: (idx) => setProgress(idx / walletATAs.length),
    });
    setNestedPairs(nested);

    setStep(3);
  }, [connected, publicKey, connection]);

  return (
    <>
      <div className="border-b border-gray-200 pb-4">
        <p className="text-sm text-gray-500">
          We can attempt to find nested associated token accounts for you. Press the button to start
          the query. This can take a while, depending on how many token accounts you own.
        </p>
      </div>
      <div className="flex justify-center py-4">
        <button
          disabled={step === 1 || step === 2}
          className={classNames(
            "inline-flex items-center rounded-md border border-transparent bg-indigo-500 py-1.5 px-3 text-white",
            "hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2",
            "disabled:bg-indigo-600 disabled:hover:bg-indigo-600"
          )}
          onClick={query}
        >
          {isSearching && <ArrowPathIcon className="-ml-1 mr-2 h-5 w-5 animate-spin" />}
          {isSearching ? "Searching..." : "Start Querying"}
        </button>
      </div>
      {step > 0 && (
        <div>
          <h4 className="sr-only">Status</h4>
          <div className="mt-6" aria-hidden="true">
            <div className="overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-2 rounded-full bg-indigo-600 transition-all"
                style={{ width: width }}
              />
            </div>
            <div className="mt-6 hidden grid-cols-3 text-sm font-medium text-gray-500 sm:grid">
              {walletAccounts ? (
                <div className={classNames(step >= 1 && "text-indigo-600")}>
                  {walletAccounts.length} ATA found
                </div>
              ) : (
                <div className={classNames(step >= 1 && "text-indigo-600")}>Finding ATAs...</div>
              )}
              <div className={classNames(step >= 2 && "text-indigo-600", "text-center leading-4")}>
                Discovering nested accounts
              </div>
              <div className={classNames(step >= 3 && "text-indigo-600", "text-right")}>Done</div>
            </div>
          </div>
        </div>
      )}
      {step === 3 && (
        <NestedList nestedTokenAccounts={nestedPairs} setNestedTokenAccounts={setNestedPairs} />
      )}
    </>
  );
};
