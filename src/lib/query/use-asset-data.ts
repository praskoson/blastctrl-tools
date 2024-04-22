import { useQuery } from "@tanstack/react-query";
import { DasAsset, HeliusResponse } from "./types";

const url = process.env.NEXT_PUBLIC_DAS_API;

export const assetDataQueryKey = (address: string) => ["asset", address] as const;

export function useAssetData(address: string) {
  return useQuery<DasAsset>({
    enabled: !!address,
    queryKey: assetDataQueryKey(address),
    queryFn: async () => {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: "text",
          method: "getAsset",
          params: {
            id: address,
            options: {
              showFungible: true,
            },
          },
        }),
      });

      if (!response.ok)
        throw Error(`Request failed with status ${response.status}: ${await response.text()}`);

      const data = (await response.json()) as HeliusResponse<DasAsset>;

      return data.result;
    },
    staleTime: Infinity,
  });
}
