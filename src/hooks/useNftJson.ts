import axios from "axios";
import useSWR from "swr";
import { JsonMetadata } from "@metaplex-foundation/js";

const fetcher = async (uri: string): Promise<JsonMetadata> =>
  (await axios.get(uri)).data as JsonMetadata;

export const useNftJson = (uri?: string) => {
  const { data, error } = useSWR<JsonMetadata, Error>(uri, fetcher, {
    errorRetryCount: 5,
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  return {
    json: data,
    isLoading: !error && !data,
    isError: error,
  };
};
