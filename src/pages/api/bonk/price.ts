import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export type QuoteData = {
  rate: number;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<QuoteData>) {
  const { quoteToken } = req.query;

  if (typeof quoteToken !== "string") {
    res.status(401);
    return;
  }

  let priceData;
  try {
    priceData = (
      await axios.get(
        "https://api.coingecko.com/api/v3/simple/price?ids=bonk%2Csolana&vs_currencies=usd"
      )
    ).data;
  } catch (err) {
    console.log({ err });
    res.status(500).json(err);
    return;
  }

  const solToUsd = Number(priceData.solana.usd);
  const bonkToUsd = Number(priceData.bonk.usd);
  const solToBonk = solToUsd * (1 / bonkToUsd);
  // SOL to Bonk
  if (quoteToken === "BONK") {
    res.status(200).json({ rate: solToBonk });
    return;
  } else if (quoteToken === "USDC") {
    res.status(200).json({ rate: solToUsd });
    return;
  } else {
    res.status(401);
  }
}
