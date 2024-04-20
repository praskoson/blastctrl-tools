import { useQuery } from "@tanstack/react-query";
import { HeliusResponse, SearchAssetsByOwnerResponse } from "./types";
import { response } from "./_cached_response";

const url = process.env.NEXT_PUBLIC_DAS_API as string;

export function useOwnerAssets(address: string) {
  return useQuery<HeliusResponse<SearchAssetsByOwnerResponse>>({
    queryKey: ["owner-assets", address],
    enabled: false,
    queryFn: async () => {
      if (!address) throw Error("No address provided");
      return response as unknown as HeliusResponse<SearchAssetsByOwnerResponse>;

      // const response = await fetch(url, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     jsonrpc: "2.0",
      //     id: "text",
      //     method: "searchAssets",
      //     params: {
      //       ownerAddress: address,
      //       limit: 100,
      //       tokenType: "fungible",
      //       options: {
      //         showZeroBalance: true,
      //       },
      //     },
      //   }),
      // });

      // if (!response.ok) {
      //   console.log("Failed to fetch owner assets");
      //   throw Error(await response.text());
      // }
      // return await response.json();
    },
    refetchOnWindowFocus: false,
    staleTime: 30000,
  });
}
