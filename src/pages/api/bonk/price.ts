import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export type QuoteData = {
  solToBonk: number;
  solToUsd: number;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<QuoteData>) {
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
    res.status(200).json({ solToBonk, solToUsd });
  } catch (err) {
    console.log({ err });
    res.status(500).json(err);
  }
}
