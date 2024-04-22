import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DasAsset, HeliusResponse } from "./types";
import { assetDataQueryKey } from "./use-asset-data";

const url = process.env.NEXT_PUBLIC_DAS_API;

export const ownerNftsKey = (address: string) => ["owner-nfts", address] as const;

export function useOwnerNfts(address: string) {
  const queryClient = useQueryClient();

  return useQuery<Array<NftAsset>>({
    enabled: !!address,
    queryKey: ownerNftsKey(address),
    queryFn: async () => {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: "text",
          method: "searchAssets",
          params: {
            authorityAddress: address,
            ownerAddress: address,
          },
        }),
      });

      if (!response.ok)
        throw Error(`Request failed with status ${response.status}: ${await response.text()}`);

      const data = (await response.json()) as HeliusResponse<SearchAssetsResult>;
      console.log("in queryfn", data);

      const filtered = data.result.items.filter((asset) => asset.burnt === false);

      for (const asset of filtered) {
        queryClient.setQueryData(assetDataQueryKey(asset.id), asset);
      }

      return filtered;
    },
    staleTime: Infinity,
  });
}

////////
// TYPES
////////
export type SearchAssetsResult = {
  cursor: string;
  limit: number;
  total: number;
  items: Array<NftAsset>;
};

export type NftAsset = {
  interface:
    | "V1_NFT"
    | "V1_PRINT"
    | "LEGACY_NFT"
    | "V2_NFT"
    | "FungibleAsset"
    | "FungibleToken"
    | "Custom"
    | "Identity"
    | "Executable"
    | "ProgrammableNFT";
  id: string;
  content: {
    $schema: string;
    json_uri: string;
    files: {
      uri: string;
      cdn_uri: string;
      mime: string;
    }[];
    metadata: {
      description: string;
      name: string;
      symbol: string;
      token_standard: string;
    };
    links: {
      external_url: string;
      image: string;
    };
  };
  authorities: {
    address: string;
    scopes: string[];
  }[];
  compression: {
    eligible: boolean;
    compressed: boolean;
    data_hash: string;
    creator_hash: string;
    asset_hash: string;
    tree: string;
    seq: number;
  };
  grouping: {
    group_key: string;
    group_value: string;
  }[];
  royalty: {
    royalty_model: string;
    target: null;
    percent: number;
    basis_points: number;
    primary_sale_happened: boolean;
    locked: boolean;
  };
  creators: {
    address: string;
    share: number;
    verified: boolean;
  }[];
  ownership: {
    frozen: boolean;
    delegated: boolean;
    delegate: string;
    ownership_model: string;
    owner: string;
  };
  supply: {
    print_max_supply: number;
    print_current_supply: number;
    edition_nonce: number;
  };
  mutable: boolean;
  burnt: boolean;
  token_info: {
    supply: number;
    decimals: number;
    token_program: string;
    associated_token_address: string;
  };
};
