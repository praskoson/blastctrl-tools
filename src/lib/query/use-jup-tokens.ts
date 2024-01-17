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

type AssetsResponse = {
  jsonrpc: string;
  id: string;
  result: {
    total: number;
    limit: number;
    cursor: string;
    items: Array<{
      interface: string;
      id: string;
      content: Record<string, any>;
      token_info: {
        balance: number;
        supply: number;
        decimals: 0;
        token_program: string;
        associated_token_address: string;
        [key: string]: any;
      };
    }>;
  };
};

const ignoreList = ["Bonk", "SOL"];

export function useJupTokens(wallet = "", strict = true) {
  return useQuery<Array<TokensResponse>, Error>({
    queryKey: ["jup-tokens", strict ? "strict" : "all", wallet || "none"],
    queryFn: async () => {
      const jupFetch = fetch(`https://token.jup.ag/${strict ? "strict" : "all"}`);

      if (!wallet) {
        const jupResponse = await jupFetch;
        if (!jupResponse.ok) {
          throw new Error("Network response was not ok");
        }

        return jupResponse.json();
      }

      const assetsFetch = fetch(process.env.NEXT_PUBLIC_DAS_API!, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          jsonrpc: "2.0",
          id: "helius-test",
          method: "searchAssets",
          params: {
            ownerAddress: wallet,
            tokenType: "fungible",
          },
        }),
      });
      const [jupResponse, assetsResponse] = await Promise.all([jupFetch, assetsFetch]);

      if (!jupResponse.ok || !assetsResponse.ok) {
        throw new Error("Network response was not ok");
      }

      const [jupTokens, userAssets] = await Promise.all([
        jupResponse.json() as Promise<TokensResponse[]>,
        assetsResponse.json() as Promise<AssetsResponse>,
      ]);

      const set = new Set(userAssets?.result?.items?.map((asset) => asset?.id));
      const intersectionTokens = jupTokens.filter((token) => set.has(token.address));

      return intersectionTokens;
    },
    select: (data) => data.filter((token) => !ignoreList.includes(token.symbol)),
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}
