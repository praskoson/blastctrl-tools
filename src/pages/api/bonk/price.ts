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
      await axios.get("https://api.coingecko.com/api/v3/simple/price?ids=bonk&vs_currencies=usd")
    ).data;
    const price = Number(data.bonk.usd);
    res.status(200).json({ rate: price });
  } catch (err) {
    console.log({ err });
    res.status(500).json(err);
  }
}
