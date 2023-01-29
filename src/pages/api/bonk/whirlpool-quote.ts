import { NextApiRequest, NextApiResponse } from "next";
import {
  AccountFetcher,
  buildWhirlpoolClient,
  ORCA_WHIRLPOOL_PROGRAM_ID,
  swapQuoteByInputToken,
  WhirlpoolContext,
} from "@orca-so/whirlpools-sdk";
import { AnchorProvider, Wallet } from "@project-serum/anchor";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { Networks } from "utils/endpoints";
import Decimal from "decimal.js";
import { DecimalUtil, Percentage } from "@orca-so/common-sdk";

export type Input = {
  amountIn: number;
  numerator: number;
  denominator: number;
};

export type WhirlpoolQuoteData = {
  estimatedAmountIn: string;
  estimatedAmountOut: string;
  estimatedFeeAmount: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<WhirlpoolQuoteData>
) {
  // BONK-SOL WHIRLPOOL
  if (req.method !== "POST") res.status(403).json(null);

  const { amountIn, denominator, numerator } = req.body as Input;

  const BONK_SOL = "3ne4mWqdYuNiYrYZC9TrA3FcfuFdErghH97vNPbjicr1";
  const connection = new Connection(Networks["mainnet-beta"]);

  const provider = new AnchorProvider(connection, new Wallet(Keypair.generate()), {});
  const ctx = WhirlpoolContext.from(
    provider.connection,
    provider.wallet,
    ORCA_WHIRLPOOL_PROGRAM_ID
  );
  const fetcher = new AccountFetcher(ctx.connection);
  const client = buildWhirlpoolClient(ctx);

  // get pool
  const SOL = { mint: new PublicKey("So11111111111111111111111111111111111111112"), decimals: 9 };
  const BONK = { mint: new PublicKey("DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263"), decimals: 5 };
  const whirlpool_pubkey = new PublicKey(BONK_SOL);

  const whirlpool = await client.getPool(whirlpool_pubkey);

  // get swap quote
  const amount_in = new Decimal(amountIn);

  const quote = await swapQuoteByInputToken(
    whirlpool,
    BONK.mint,
    DecimalUtil.toU64(amount_in, BONK.decimals), // toU64
    Percentage.fromFraction(numerator, denominator), // acceptable slippage is 1.0% (10/1000)
    ctx.program.programId,
    fetcher,
    true // refresh
  );

  const estimatedAmountIn = DecimalUtil.fromU64(quote.estimatedAmountIn, BONK.decimals).toString();
  const estimatedAmountOut = DecimalUtil.fromU64(quote.estimatedAmountOut, SOL.decimals).toString();
  const estimatedFeeAmount = DecimalUtil.fromU64(quote.estimatedFeeAmount, SOL.decimals).toString();

  try {
    res.status(200).json({ estimatedAmountIn, estimatedAmountOut, estimatedFeeAmount });
  } catch (err) {
    console.log({ err });
    res.status(500).json(err);
  }
}
