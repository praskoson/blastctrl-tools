import base58 from "bs58";
import { Connection, PublicKey, Transaction, VersionedTransaction } from "@solana/web3.js";
import {
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  getAssociatedTokenAddress,
} from "@solana/spl-token-next";

export type TokenFee = {
  mint: string;
  account: string;
  decimals: number;
  fee: number;
  burnFeeBp?: number;
  transferFeeBp?: number;
};

export type OctaneConfig = {
  feePayer: string;
  rpcUrl: string;
  maxSignatures: number;
  lamportsPerSignature: number;
  corsOrigin: boolean;
  endpoints: {
    transfer: { tokens: TokenFee[] };
    createAssociatedTokenAccount: { tokens: TokenFee[] };
    whirlpoolsSwap: { tokens: TokenFee[] };
  };
};

type WhirlpoolsQuote = {
  estimatedAmountIn: string;
  estimatedAmountOut: string;
  estimatedEndTickIndex: number;
  estimatedEndSqrtPrice: string;
  estimatedFeeAmount: string;
  amount: string;
  amountSpecifiedIsInput: boolean;
  aToB: boolean;
  otherAmountThreshold: string;
  sqrtPriceLimit: string;
  tickArray0: string;
  tickArray1: string;
  tickArray2: string;
};

export interface BuildWhirlpoolsSwapResponse {
  status: "ok";
  transaction: string;
  quote: WhirlpoolsQuote;
  messageToken: string;
}

const OCTANE_ENDPOINT = "https://octane-server-seven.vercel.app/api";
// const OCTANE_ENDPOINT = "http://localhost:3001/api";

export async function createAssociatedTokenAccount(transaction: Transaction): Promise<string> {
  return fetch(OCTANE_ENDPOINT + "/createAssociatedTokenAccount", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      transaction: base58.encode(transaction.serialize({ requireAllSignatures: false })),
    }),
  })
    .then((res) => res.json())
    .then((data) => data.signature as string);
}

export async function sendTransactionWithTokenFee(transaction: Transaction): Promise<string> {
  return fetch(OCTANE_ENDPOINT + "/transfer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      transaction: base58.encode(transaction.serialize({ requireAllSignatures: false })),
    }),
  })
    .then((res) => res.json())
    .then((data) => data.signature as string);
}

export async function buildWhirlpoolsSwapTransaction(
  user: PublicKey,
  sourceMint: string,
  amount: number,
  slippingTolerance: number = 0.5,
): Promise<{ transaction: VersionedTransaction; quote: WhirlpoolsQuote; messageToken: string }> {
  const response = await fetch(OCTANE_ENDPOINT + "/buildWhirlpoolsSwap", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user: user.toBase58(),
      sourceMint: sourceMint,
      amount: amount,
      slippingTolerance: slippingTolerance,
    }),
  })
    .then((res) => res.json())
    .then((data) => data as BuildWhirlpoolsSwapResponse);

  return {
    transaction: VersionedTransaction.deserialize(base58.decode(response.transaction)),
    quote: response.quote,
    messageToken: response.messageToken,
  };
}

export async function sendWhirlpoolsSwapTransaction(
  transaction: VersionedTransaction,
  messageToken: string,
): Promise<string> {
  const res = await fetch(OCTANE_ENDPOINT + "/sendWhirlpoolsSwap", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ transaction: base58.encode(transaction.serialize()), messageToken }),
  });
  const data = await res.json();
  return data.signature as string;
  // const response = (
  //   await axios.post(OCTANE_ENDPOINT + "/sendWhirlpoolsSwap", {
  //     transaction: base58.encode(transaction.serialize()),
  //     messageToken,
  //   })
  // ).data;
  // return response.signature as string;
}

export async function buildTransactionToTransfer(
  connection: Connection,
  feePayer: PublicKey,
  fee: TokenFee,
  mint: PublicKey,
  sender: PublicKey,
  recipient: PublicKey,
  transferAmountInDecimals: number,
): Promise<Transaction> {
  const feeInstruction = createTransferInstruction(
    await getAssociatedTokenAddress(mint, sender),
    new PublicKey(fee.account),
    sender,
    fee.fee,
  );
  const transferInstruction = createTransferInstruction(
    await getAssociatedTokenAddress(mint, sender),
    await getAssociatedTokenAddress(mint, recipient),
    sender,
    transferAmountInDecimals,
  );
  return new Transaction({
    recentBlockhash: (await connection.getRecentBlockhashAndContext()).value.blockhash,
    feePayer: feePayer,
  }).add(feeInstruction, transferInstruction);
}

export async function buildTransactionToCreateAccount(
  connection: Connection,
  feePayer: PublicKey,
  fee: TokenFee,
  mint: PublicKey,
  sender: PublicKey,
  recipient: PublicKey,
): Promise<Transaction> {
  const feeInstruction = createTransferInstruction(
    await getAssociatedTokenAddress(mint, sender),
    new PublicKey(fee.account),
    sender,
    fee.fee,
  );
  const accountInstruction = createAssociatedTokenAccountInstruction(
    feePayer,
    await getAssociatedTokenAddress(mint, recipient),
    recipient,
    mint,
  );
  return new Transaction({
    recentBlockhash: (await connection.getRecentBlockhashAndContext()).value.blockhash,
    feePayer: feePayer,
  }).add(feeInstruction, accountInstruction);
}
