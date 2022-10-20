import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { useLocalStorage } from "@solana/wallet-adapter-react";
import { createContext, FC, ReactNode, useContext } from "react";

export interface NetworkConfigurationState {
  networkConfiguration: WalletAdapterNetwork;
  setNetworkConfiguration(networkConfiguration: string): void;
}

export const NetworkConfigurationContext = createContext<NetworkConfigurationState>({
  networkConfiguration: "mainnet-beta",
} as NetworkConfigurationState);

export function useNetworkConfiguration(): NetworkConfigurationState {
  return useContext(NetworkConfigurationContext);
}

export const NetworkConfigurationProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [networkConfiguration, setNetworkConfiguration] = useLocalStorage(
    "network",
    "mainnet-beta"
  );

  return (
    <NetworkConfigurationContext.Provider
      value={{
        networkConfiguration: networkConfiguration as WalletAdapterNetwork,
        setNetworkConfiguration,
      }}
    >
      {children}
    </NetworkConfigurationContext.Provider>
  );
};
