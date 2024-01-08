import { useQuery } from "@tanstack/react-query";

type PriceResponse = {
  SOL: {
    id: string; // Address of a token
    mintSymbol: string; // Symbol of id token
    vsToken: string; // Address of vs token
    vsTokenSymbol: string; // Symbol of vs token
    price: number; // Default: 1 unit of the token worth in USDC if vsToken isn't specified
  };
  timeTaken: number;
};

const BASE_URL = "https://price.jup.ag/v4/price";

export function useJupPrice(mintOrSymbol: string, vsMint: string) {
  return useQuery<PriceResponse, Error>({
    enabled: !!mintOrSymbol && !!vsMint,
    queryKey: ["jup-price", mintOrSymbol, vsMint],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("ids", mintOrSymbol);
      params.append("vsToken", vsMint);
      const url = new URL(BASE_URL);
      url.search = params.toString();

      const priceResponse = await fetch(url);
      if (!priceResponse.ok) {
        throw new Error("Error fetching price");
      }
      return priceResponse.json().then((res) => res?.data);
    },
  });
}
