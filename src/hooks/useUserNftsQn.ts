import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useNetworkConfiguration } from "contexts/NetworkConfigurationProvider";
import { useMemo } from "react";
import useSWR from "swr";
import { notify } from "utils/notifications";
import { mergeClusterApiUrl } from "utils/spl/common";

export type NftResponseObject = {
  owner: string;
  assets: {
    name: string;
    tokenAddress: string;
    collectionName: string;
    imageUrl: string;
    collectionAddress: string;
    creators: string[];
    chain: string;
    network: string;
  }[];
  totalItems: number;
  totalPages: number;
  pageNumber: number;
};

const fetcher = async (url: string, body: BodyInit) => {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
  });

  if (!res.ok) {
    const error = new Error("Error occured while fetching data.");
    error.cause = {
      info: await res.json(),
      status: res.status,
    };
    throw error;
  }

  return res.json();
};

export const useUserNftsQn = () => {
  const { publicKey } = useWallet();
  const { networkConfiguration } = useNetworkConfiguration();
  const endpoint = mergeClusterApiUrl(networkConfiguration);

  const wallet58 = useMemo(() => publicKey?.toBase58(), [publicKey]);

  const data = JSON.stringify({
    jsonrpc: "2.0",
    id: 1,
    method: "qn_fetchNFTs",
    params: {
      wallet: wallet58,
      omitFields: ["provenance", "traits"],
      page: 1,
      perPage: 40,
    },
  });

  const { data: nfts, error } = useSWR(() => (wallet58 ? [endpoint, data] : null), fetcher, {
    refreshInterval: 60000,
    onErrorRetry: (error, _, __, revalidate, { retryCount }) => {
      if (
        error?.cause?.status === 403 ||
        error?.cause?.status === 404 ||
        error?.cause?.status === 429
      ) {
        notify({ type: "error", message: "Error fetching user NFTs" });
      }

      if (retryCount >= 3) return;

      setTimeout(() => revalidate({ retryCount }), 5000);
    },
  });

  return {
    nfts: nfts ? (nfts.result as NftResponseObject) : null,
    isLoading: !error && !nfts,
    isError: error,
  };
};
