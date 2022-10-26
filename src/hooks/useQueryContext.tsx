import { useRouter } from "next/router";
import { useNetworkConfigurationStore } from "stores/useNetworkConfiguration";
import { EndpointTypes } from "../models/types";

export default function useQueryContext() {
  const { network } = useNetworkConfigurationStore()

  const endpoint = network || "mainnet-beta";
  const hasClusterOption = endpoint !== "mainnet-beta";
  const fmtUrlWithCluster = (url: string) => {
    if (hasClusterOption) {
      const mark = url.includes("?") ? "&" : "?";
      return decodeURIComponent(`${url}${mark}cluster=${endpoint}`);
    }
    return url;
  };

  return {
    fmtUrlWithCluster,
  };
}
