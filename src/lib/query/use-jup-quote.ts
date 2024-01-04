import { useQuery } from "@tanstack/react-query";

const QUOTE_API_BASE = "https://quote-api.jup.ag/v6/quote";

type UseJupQueryArgs = {
  inputMint: string;
  amount: number;
  slippageBps?: number;
};

type QuoteResponse = {
  inputMint: string;
  inAmount: string;
  outputMint: string;
  outAmount: string;
  otherAmountThreshold: string;
  swapMode: "ExactIn" | "ExactOut";
  slippageBps: number;
  platformFee?: {
    amount: string;
    feeBps: number;
  };
  priceImpactPct: string;
  contextSlot?: number;
  timeTaken?: number;
};

export function useJupQuery({ inputMint, amount, slippageBps = 50 }: UseJupQueryArgs) {
  const outputMint = "So11111111111111111111111111111111111111112";

  return useQuery<QuoteResponse, Error>({
    queryKey: ["jup-quote", inputMint, amount],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("inputMint", inputMint);
      params.append("outputMint", outputMint);
      params.append("amount", amount.toString());
      params.append("slippageBps", slippageBps.toString());

      const url = new URL(QUOTE_API_BASE);
      url.search = params.toString();
      const quoteResponse = await fetch(url);

      if (!quoteResponse.ok) {
        throw new Error("Network response was not ok");
      }
      return quoteResponse.json();
    },
    enabled: !!inputMint && !!outputMint && !!amount,
  });
}
