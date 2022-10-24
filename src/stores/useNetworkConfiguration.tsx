import create, { State } from "zustand";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { persist } from "zustand/middleware";

interface NetworkConfigurationStore extends State {
  network: WalletAdapterNetwork;
  setNetwork: (network: WalletAdapterNetwork) => void;
}

export const useNetworkConfigurationStore = create<NetworkConfigurationStore>(
  persist(
    (set) => ({
      network: WalletAdapterNetwork.Mainnet,
      setNetwork: (network) => set({ network: network }),
    }),
    {
      name: "network",
      getStorage: () => localStorage,
    }
  )
);
