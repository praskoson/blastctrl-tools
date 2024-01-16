import { useQuery } from "@tanstack/react-query";

type TokensResponse = {
  address: string;
  chainId: number;
  decimals: number;
  name: string;
  symbol: string;
  logoURI: string;
  tags: string[];
  extensions: {
    [key: string]: string;
  };
};

const ignoreList = ["Bonk", "SOL"];

export function useJupTokens(strict = true) {
  return useQuery<Array<TokensResponse>, Error>({
    queryKey: ["jup-tokens"],
    queryFn: async () => {
      const quoteResponse = await fetch("https://token.jup.ag/strict");

      if (!quoteResponse.ok) {
        throw new Error("Network response was not ok");
      }

      return quoteResponse.json();
    },
    select: (data) => data.filter((token) => !ignoreList.includes(token.symbol)),
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}
