import { Dialog } from "@headlessui/react";
import { useCloseAccountsStore } from "./wizard-context";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { chunk, retryWithBackoff } from "lib/utils";
import { ParsedTokenAccount } from "lib/query/use-owner-assets";
import { createCloseAccountInstruction } from "@solana/spl-token-next";
import { PublicKey, Transaction } from "@solana/web3.js";
import { useCallback, useEffect, useRef, useState } from "react";
import { notify } from "components/Notification";

export const SignStep = () => {
  const promptShown = useRef(false);
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [isConfirming, setIsConfirming] = useState(false);
  const accountsToClose = useCloseAccountsStore((store) => store.simulatedAccounts);
  const goToStepThree = useCloseAccountsStore((store) => store.goToStepThree);

  const handleSendTransaction = useCallback(async () => {
    if (!publicKey || !sendTransaction) return;
    const chunks = chunk(accountsToClose, 4);

    const closedAccounts: ParsedTokenAccount[] = [];

    try {
      for (const chunk of chunks) {
        const tx = makeTransaction(chunk, publicKey);

        const { context, value } = await retryWithBackoff(() =>
          connection.getLatestBlockhashAndContext("confirmed"),
        );
        const signature = await sendTransaction(tx, connection, {
          minContextSlot: context.slot,
          maxRetries: 0,
          preflightCommitment: "confirmed",
          skipPreflight: true,
        });
        if (!isConfirming) {
          setIsConfirming(true);
        }

        console.log(signature);

        const result = await connection.confirmTransaction(
          {
            signature,
            blockhash: value.blockhash,
            lastValidBlockHeight: value.lastValidBlockHeight,
          },
          "confirmed",
        );

        if (result.value.err) throw Error(JSON.stringify(result.value.err));

        notify({ type: "success", title: "Transaction confirmed", txid: signature });

        closedAccounts.push(...chunk);
      }

      goToStepThree(closedAccounts, null);
    } catch (err) {
      notify({ type: "error", title: "Transaction error", description: err.message });
      goToStepThree(closedAccounts, err.message);
    } finally {
      setIsConfirming(false);
    }
  }, [accountsToClose, connection, isConfirming, publicKey, sendTransaction, goToStepThree]);

  useEffect(() => {
    if (!promptShown.current) {
      promptShown.current = true;
      void handleSendTransaction();
    }
  }, [publicKey, handleSendTransaction]);

  return (
    <>
      <Dialog.Description className="space-y-1 text-zinc-500">
        <span className="block">
          Confirm the transactions in your wallet. The transactions will close{" "}
          <strong className="text-blue-500">{accountsToClose.length}</strong> accounts.
        </span>
        <span className="block">
          Expected balance change:{" "}
          <strong className="text-green-600">
            &uarr; {accountsToClose.length * 0.0020342} SOL
          </strong>
        </span>
        {isConfirming && <Loader />}
      </Dialog.Description>
    </>
  );
};

const Loader = () => {
  const [dots, setDots] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setDots((prev) => (prev + 1) % 16);
    }, 1000);

    return () => {
      clearInterval(id);
      setDots(0);
    };
  }, []);

  return (
    <span className="mt-auto block text-zinc-500">
      <span>Confirming transaction(s) </span>
      <span className="text-xl font-semibold text-blue-500">
        {new Array(dots).fill(".").join("")}
      </span>
    </span>
  );
};

// Utility functions
const toPubkey = (address: string) => new PublicKey(address);

const makeTransaction = (accounts: ParsedTokenAccount[], wallet: PublicKey) => {
  const instructions = accounts.map((acc) =>
    createCloseAccountInstruction(
      toPubkey(acc.token_account),
      wallet,
      wallet,
      [],
      toPubkey(acc.token_program),
    ),
  );

  return new Transaction().add(...instructions);
};
