import { useCallback } from "react";

import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  Commitment,
  RpcResponseAndContext,
  SignatureResult,
  Transaction,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";

type SendTransactionOptions = {
  commitment?: Commitment;
  skipPreflight?: boolean;
};

export type SendAndConfirmReturnType = {
  signature: string;
  result: RpcResponseAndContext<SignatureResult>;
};

export const useWalletConnection = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const sendAndConfirmTransaction = useCallback(
    async (
      transaction: Transaction,
      opts?: SendTransactionOptions
    ): Promise<SendAndConfirmReturnType> => {
      if (!publicKey) throw new WalletNotConnectedError();

      const {
        context: { slot: minContextSlot },
        value: { blockhash, lastValidBlockHeight },
      } = await connection.getLatestBlockhashAndContext();

      const signature = await sendTransaction(transaction, connection, {
        minContextSlot,
        skipPreflight: opts?.skipPreflight,
      });

      console.log(signature);

      const result = await connection.confirmTransaction(
        { blockhash, lastValidBlockHeight, signature },
        opts?.commitment
      );

      return { signature, result };
    },
    [publicKey, sendTransaction, connection]
  );

  const simulateVersionedTransaction = useCallback(
    async (instructions: TransactionInstruction[]) => {
      const {
        context: { slot: minContextSlot },
        value: { blockhash, lastValidBlockHeight },
      } = await connection.getLatestBlockhashAndContext();

      const messageV0 = new TransactionMessage({
        payerKey: publicKey,
        recentBlockhash: blockhash,
        instructions,
      }).compileToV0Message();

      const tx = new VersionedTransaction(messageV0);

      return await connection.simulateTransaction(tx);
    },
    [connection, publicKey]
  );

  const sendAndConfirmVersionedTransaction = useCallback(
    async (instructions: TransactionInstruction[]) => {
      const {
        context: { slot: minContextSlot },
        value: { blockhash, lastValidBlockHeight },
      } = await connection.getLatestBlockhashAndContext();

      const messageV0 = new TransactionMessage({
        payerKey: publicKey,
        recentBlockhash: blockhash,
        instructions,
      }).compileToV0Message();

      const tx = new VersionedTransaction(messageV0);
      const signature = await sendTransaction(tx, connection, { minContextSlot });
      const result = await connection.confirmTransaction({
        blockhash,
        lastValidBlockHeight,
        signature,
      });

      return { signature, result };
    },
    [connection, publicKey, sendTransaction]
  );

  return {
    wallet: publicKey,
    connection,
    sendAndConfirmTransaction,
    sendAndConfirmVersionedTransaction,
    simulateVersionedTransaction,
  };
};
