import {
  AccountLayout,
  AccountState,
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  TransferFeeAmountLayout,
} from "@solana/spl-token-next";
import { useConnection } from "@solana/wallet-adapter-react";
import { GetProgramAccountsFilter, PublicKey } from "@solana/web3.js";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DasAsset, HeliusResponse } from "./types";
import { assetDataQueryKey } from "./use-asset-data";

const url = process.env.NEXT_PUBLIC_DAS_API as string;

export type ParsedTokenAccount = {
  token_account: string;
  mint: string;
  balance: bigint;
  isFrozen: boolean;
  token_program: string;
};

export const ownerAssetsKey = (address: string) => ["owner-assets", address] as const;

export function useOwnerAssets(address: string, delay?: number) {
  const { connection } = useConnection();
  const queryClient = useQueryClient();

  // TODO: if a token doesn't exist in the queryClient cache,
  // add it an array and fetch all missing ones with getAssetBatch
  return useQuery<ParsedTokenAccount[]>({
    queryKey: ["owner-assets", address],
    enabled: false,
    queryFn: async () => {
      if (!address) throw Error("No address provided");

      const filters = getFilters(address);
      const results = await connection.getProgramAccounts(TOKEN_PROGRAM_ID, { filters });
      const results22 = await connection.getTokenAccountsByOwner(new PublicKey(address), {
        programId: TOKEN_2022_PROGRAM_ID,
      });

      const parsedResults = [...results, ...results22.value].map(({ pubkey, account }) => {
        const parsed = AccountLayout.decode(account.data);

        return {
          token_account: pubkey.toBase58(),
          mint: parsed.mint.toBase58(),
          balance: parsed.amount,
          isFrozen: parsed.state === AccountState.Frozen,
          token_program: account.owner.toBase58(),
        };
      });

      const uncachedAssets = parsedResults.filter((v) => {
        return v.balance === 0n && !queryClient.getQueryData(assetDataQueryKey(v.mint));
      });

      // Fetch assetsBatch, but if it fails, continue anyway
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: "text",
            method: "getAssetBatch",
            params: { ids: uncachedAssets.map((a) => a.mint) },
          }),
        });
        if (!response.ok) throw Error("Failed to get asset info");
        const assets = (await response.json()) as HeliusResponse<DasAsset[]>;

        for (const asset of assets.result) {
          queryClient.setQueryData<DasAsset>(assetDataQueryKey(asset.id), asset);
        }
      } catch (err) {
        console.log(err.message);
      } finally {
        return parsedResults;
      }
    },
    refetchOnWindowFocus: false,
    staleTime: 60000,
  });
}

const getFilters = (ownerAddress: string): GetProgramAccountsFilter[] => {
  return [
    {
      dataSize: 165,
    },
    {
      memcmp: {
        offset: 32,
        bytes: new PublicKey(ownerAddress).toBase58(),
      },
    },
  ];
};
const getFilters22 = (ownerAddress: string): GetProgramAccountsFilter[] => {
  return [
    {
      memcmp: {
        offset: 32,
        bytes: new PublicKey(ownerAddress).toBase58(),
      },
    },
  ];
};
