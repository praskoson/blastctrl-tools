import { NextApiRequest, NextApiResponse } from "next";
import {
  AccountFetcher,
  buildWhirlpoolClient,
  ORCA_WHIRLPOOL_PROGRAM_ID,
  SwapQuote,
  swapQuoteByInputToken,
  swapQuoteByOutputToken,
  WhirlpoolContext,
} from "@orca-so/whirlpools-sdk";
import { AnchorProvider, Wallet } from "@project-serum/anchor";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { Networks } from "utils/endpoints";
import Decimal from "decimal.js";
import { DecimalUtil, Percentage } from "@orca-so/common-sdk";
import { NATIVE_MINT, getMint } from "@solana/spl-token-next";

export type Input = {
  quoteMint: string;
  amountIn?: number;
  amountOut?: number;
  numerator: number;
  denominator: number;
};

export type WhirlpoolQuoteData = {
  estimatedAmountIn: string;
  estimatedAmountOut: string;
  estimatedFeeAmount: string;
};

// quote token <-> pool address
const PoolMap = new Map<string, PublicKey>([
  // Bonk
  [
    "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
    new PublicKey("3ne4mWqdYuNiYrYZC9TrA3FcfuFdErghH97vNPbjicr1"),
  ],
  // USDC
  [
    "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    new PublicKey("7qbRF6YsyGuLUVs6Y1q64bdVrfe4ZcUUz1JRdoVNUJnm"),
  ],
]);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<WhirlpoolQuoteData | { error: string }>
) {
  // BONK-SOL WHIRLPOOL
  if (req.method !== "POST") res.status(403).json(null);
  const { quoteMint, amountIn, amountOut, denominator, numerator } = req.body as Input;

  const connection = new Connection(Networks["mainnet-beta"]);
  const provider = new AnchorProvider(connection, new Wallet(Keypair.generate()), {});
  const ctx = WhirlpoolContext.from(
    provider.connection,
    provider.wallet,
    ORCA_WHIRLPOOL_PROGRAM_ID
  );
  const fetcher = new AccountFetcher(ctx.connection);
  const client = buildWhirlpoolClient(ctx);

  const quoteToken = new PublicKey(quoteMint);
  const whirlpool_pubkey = PoolMap.get(quoteMint);
  if (!whirlpool_pubkey) {
    res.status(401).json({ error: "Invalid quote mint" });
    return;
  }

  const decimals = (await getMint(connection, quoteToken)).decimals;
  const whirlpool = await client.getPool(whirlpool_pubkey);

  // get swap quote
  let quote: SwapQuote;
  if (amountIn) {
    const amount_in = new Decimal(amountIn);

    quote = await swapQuoteByInputToken(
      whirlpool,
      quoteToken,
      DecimalUtil.toU64(amount_in, decimals), // toU64
      Percentage.fromFraction(numerator, denominator), // acceptable slippage is 1.0% (10/1000)
      ctx.program.programId,
      fetcher,
      true // refresh
    );
  } else {
    const amount_out = new Decimal(amountOut);
    quote = await swapQuoteByOutputToken(
      whirlpool,
      NATIVE_MINT,
      DecimalUtil.toU64(amount_out, 9),
      Percentage.fromFraction(numerator, denominator),
      ctx.program.programId,
      fetcher,
      true
    );
  }

  const estimatedAmountIn = DecimalUtil.fromU64(quote.estimatedAmountIn, decimals).toString();
  const estimatedAmountOut = DecimalUtil.fromU64(quote.estimatedAmountOut, 9).toString();
  const estimatedFeeAmount = DecimalUtil.fromU64(quote.estimatedFeeAmount, 9).toString();

  try {
    res.status(200).json({ estimatedAmountIn, estimatedAmountOut, estimatedFeeAmount });
  } catch (err) {
    console.log({ err });
    res.status(500).json(err);
  }
}
