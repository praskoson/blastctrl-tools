import { Account, getAssociatedTokenAddressSync, getMint } from "@solana/spl-token-next";
import { compress } from "utils/spl";
import { findTokenByMint } from "utils/spl/common-tokens";
import { findNestedAta } from "utils/spl/nested-ata";
import Image from "next/image";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/solid";
import { ArrowPathIcon, ChevronRightIcon, WalletIcon } from "@heroicons/react/20/solid";
import { isATA, normalizeTokenAmount } from "utils/spl/common";
import { notify } from "components/Notification";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Transaction } from "@solana/web3.js";
import { createRecoverNestedTokenAccountInstruction } from "utils/spl/token";
import { Dispatch, SetStateAction, useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Tooltip } from "components/Tooltip";

type NestedPairs = Awaited<ReturnType<typeof findNestedAta>>;

type NestedListProps = {
  nestedTokenAccounts?: NestedPairs;
  setNestedTokenAccounts: Dispatch<SetStateAction<NestedPairs>>;
};

export const NestedList = ({ nestedTokenAccounts, setNestedTokenAccounts }: NestedListProps) => {
  const [parent] = useAutoAnimate<HTMLUListElement>();

  if (!nestedTokenAccounts || nestedTokenAccounts?.length === 0) {
    return <div className="pt-4 pb-1 font-normal">No nested accounts found ✔</div>;
  }

  const singleOrMany = nestedTokenAccounts.length === 1;

  return (
    <div className="mt-4 border-t border-gray-200 pt-4 pb-1">
      <h3 className="text-center font-medium text-indigo-600">
        {nestedTokenAccounts.length} nested token account{singleOrMany ? "" : "s"} found.
      </h3>

      <ul ref={parent} role="list" className="mt-4 w-full space-y-4">
        {nestedTokenAccounts.map(({ parent, nested }, idx) => (
          <li key={idx}>
            <NestedInfo
              key={idx}
              parent={parent}
              nested={nested}
              idx={idx}
              setNestedTokenAccounts={setNestedTokenAccounts}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export const NestedInfo = ({
  parent,
  nested,
  idx,
  setNestedTokenAccounts,
}: {
  parent: Account;
  nested: Account;
  idx: number;
  setNestedTokenAccounts: Dispatch<SetStateAction<NestedPairs>>;
}) => {
  const { connection } = useConnection();
  const { publicKey: wallet, connected, sendTransaction } = useWallet();
  const [confirming, setConfirming] = useState(false);

  const parentTokenInfo = findTokenByMint(parent.mint.toBase58());
  const nestedTokenInfo = findTokenByMint(nested.mint.toBase58());
  const recoverable = isATA({ address: nested.address, owner: parent.address, mint: nested.mint });

  const handleRecover = async () => {
    if (!connected) {
      notify({ type: "error", description: "Connect your wallet" });
      return;
    }
    let nestedDecimals = nestedTokenInfo?.decimals;
    if (!nestedDecimals) {
      const info = await getMint(connection, nested.mint);
      nestedDecimals = info.decimals;
    }

    try {
      const destination = getAssociatedTokenAddressSync(nested.mint, wallet, true);
      const {
        context: { slot: minContextSlot },
        value: { blockhash, lastValidBlockHeight },
      } = await connection.getLatestBlockhashAndContext();
      const tx = new Transaction().add(
        createRecoverNestedTokenAccountInstruction(
          wallet,
          nested.address,
          nested.mint,
          destination,
          parent.address,
          parent.mint
        )
      );
      setConfirming(true);
      const signature = await sendTransaction(tx, connection, { minContextSlot });
      console.log(signature);
      const { value } = await connection.confirmTransaction({
        blockhash,
        lastValidBlockHeight,
        signature,
      });
      if (value.err) throw Error("Error confirming transaction.");
      notify({
        type: "success",
        title: "Recover nested success",
        description: (
          <>
            Transaction success, recovered{" "}
            <span className="font-medium text-blue-300">
              {normalizeTokenAmount(nested.amount.toString(), nestedDecimals)}
            </span>{" "}
            tokens.
          </>
        ),
        txid: signature,
      });
      setNestedTokenAccounts((prev) => {
        const copy = [...prev];
        copy.splice(idx, 1);
        return copy;
      });
    } catch (err) {
      console.log({ err });
      notify({
        type: "error",
        title: "Error confirming recover nested",
        description: err?.message ? (
          <span className="break-all">{err.message}</span>
        ) : (
          "Unknown error, check the console for more details"
        ),
      });
    } finally {
      setConfirming(false);
    }
  };

  return (
    <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow ring-1 ring-black/5">
      <div className="px-4 py-5 sm:p-6">
        <div className="grid gap-y-4 xs:grid-cols-2">
          {[parent, nested].map((account, idx) => {
            const tokenInfo = idx === 0 ? parentTokenInfo : nestedTokenInfo;

            return (
              <div key={idx} className="flex">
                <div className="mr-4 mt-2 flex-shrink-0 self-start">
                  {tokenInfo ? (
                    <Image
                      src={tokenInfo.image}
                      className="rounded-full"
                      alt="Token logo"
                      height={40}
                      width={40}
                    />
                  ) : (
                    <QuestionMarkCircleIcon className="h-10 w-10 rounded-full text-blue-400" />
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-gray-700">
                    {idx === 0 ? "Parent" : "Nested"}
                  </h4>
                  {tokenInfo ? (
                    <p className="text-sm text-gray-700">{tokenInfo.ticker}</p>
                  ) : (
                    <p className="font-mono font-medium leading-5 tracking-tighter text-gray-700">
                      {compress(account.mint.toBase58(), 6)}
                    </p>
                  )}
                  <p className="tracking-tigher font-mono font-medium leading-5 text-gray-500">
                    {compress(account.address.toBase58(), 6)}
                  </p>
                  <div className="mt-2 inline-flex w-full items-center justify-end">
                    <WalletIcon className="mr-1 h-3 w-3 text-gray-500" />
                    <span className="font-mono text-gray-900 underline">
                      {normalizeTokenAmount(
                        account.amount.toString(),
                        tokenInfo?.decimals ?? 0
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex justify-end bg-gray-50 px-4 py-2 sm:px-6">
        {recoverable ? (
          <button
            type="button"
            onClick={handleRecover}
            disabled={confirming || !recoverable}
            className="inline-flex items-center rounded-full border border-transparent bg-green-600 px-3 py-0.5 text-sm text-white hover:bg-green-700 disabled:bg-green-700"
          >
            {confirming ? (
              <>
                <ArrowPathIcon className="ml-1 mr-1 h-5 w-5 animate-spin text-white" />
                Confirming
              </>
            ) : (
              <>
                Recover
                <ChevronRightIcon className="ml-1 -mr-2 h-5 w-5" />
              </>
            )}
          </button>
        ) : (
          <div className="inline-flex items-center">
            😥 Unrecoverable
            <Tooltip
              content={
                "Currently, only nested associated token accounts can be recovered. It isn't possible to recover regular token accounts."
              }
            >
              <QuestionMarkCircleIcon className="ml-2 h-5 w-5 text-gray-400 hover:cursor-pointer" />
            </Tooltip>
          </div>
        )}
      </div>
    </div>
  );
};
