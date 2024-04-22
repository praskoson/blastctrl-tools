import { TOKEN_PROGRAM_ID } from "@solana/spl-token-next";
import { ParsedTokenAccount } from "lib/query/use-owner-assets";
import { type ReactNode, createContext, useState, useContext } from "react";
import { useStore } from "zustand";
import { StoreApi, createStore } from "zustand/vanilla";

interface Store {
  currentStep: number; // current step in the wizard
  initialAccounts: ParsedTokenAccount[]; // token accounts to close that we pass initially to the store
  simulatedAccounts: ParsedTokenAccount[]; // token accounts that were succesfully simulated so we can use them in the final transactions
  closedAccounts: ParsedTokenAccount[]; // token accounts that were actually closed
  error: any;
  goToStepTwo: (accountsToBeClosed: ParsedTokenAccount[]) => void;
  goToStepThree: (closedAccounts: ParsedTokenAccount[], error?: any) => void;
  closeDialog: () => void;
}

const CloseAccountsContext = createContext(null as any as StoreApi<Store>);

export const CloseAccountsProvider = ({
  children,
  initialAccounts,
  closeDialog,
}: {
  children: ReactNode;
  initialAccounts: ParsedTokenAccount[];
  closeDialog: () => void;
}) => {
  const [store] = useState(() => {
    const store = createStore<Store>()((set) => ({
      closeDialog,
      currentStep: 0,
      initialAccounts: initialAccounts,
      simulatedAccounts: [],
      closedAccounts: [],
      error: null,
      goToStepTwo: (accounts) => set(() => ({ simulatedAccounts: accounts, currentStep: 1 })),
      goToStepThree: (accounts, error) =>
        set(() => ({ currentStep: 2, error, closedAccounts: accounts })),
    }));
    return store;
  });

  return <CloseAccountsContext.Provider value={store}>{children}</CloseAccountsContext.Provider>;
};

export const useCloseAccountsStore = <T,>(selector: (state: Store) => T): T => {
  const store = useContext(CloseAccountsContext);
  if (!store) {
    throw new Error("Missing BearStoreProvider");
  }
  return useStore(store, selector);
};
