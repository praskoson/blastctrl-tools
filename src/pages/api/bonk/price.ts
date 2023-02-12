import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export type BonkQuoteData = {
  rate: number;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<BonkQuoteData>) {
  // BONK-SOL WHIRLPOOL
  const BONK_SOL = "3ne4mWqdYuNiYrYZC9TrA3FcfuFdErghH97vNPbjicr1";

  try {
    const data = await (
      await axios.get(
        "https://api.coingecko.com/api/v3/simple/price?ids=bonk%2Csolana&vs_currencies=usd"
      )
    ).data;

    // SOL to Bonk
    const solToUsd = Number(data.solana.usd);
    const bonkToUsd = Number(data.bonk.usd);
    const solToBonk = solToUsd * (1 / bonkToUsd);
    res.status(200).json({ rate: solToBonk });
  } catch (err) {
    console.log({ err });
    res.status(500).json(err);
  }
}
