import { Dialog } from "@headlessui/react";
import { useCloseAccountsStore } from "./wizard-context";
import { useQueryClient } from "@tanstack/react-query";
import { ownerAssetsKey } from "lib/query/use-owner-assets";
import { useWallet } from "@solana/wallet-adapter-react";

const btnPrimary =
  "rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600";

export const FinalStep = () => {
  const queryClient = useQueryClient();
  const { publicKey } = useWallet();
  const closeDialog = useCloseAccountsStore((store) => store.closeDialog);
  const simulatedAccounts = useCloseAccountsStore((store) => store.simulatedAccounts);
  const closedAccounts = useCloseAccountsStore((store) => store.closedAccounts);
  const error = useCloseAccountsStore((store) => store.error);

  const handleCloseDialog = async () => {
    queryClient.setQueryData(ownerAssetsKey(publicKey.toBase58()), undefined);

    // small delay
    void queryClient.fetchQuery({ queryKey: ownerAssetsKey(publicKey.toBase58()) });

    closeDialog();
  };

  if (error) {
    return (
      <>
        <Dialog.Description className="space-y-1 text-zinc-500">
          <span className="block">
            <strong className="text-blue-500">{closedAccounts.length}</strong> accounts were closed
            out of <strong className="text-blue-500">{simulatedAccounts.length}</strong> that
            succesfully simulated. Check the error message below for the cause of the error.
          </span>
          <code className="block w-full max-w-full overflow-x-auto p-1 text-xs shadow-sm">
            {String(error) ?? "There was no error message"}
          </code>
        </Dialog.Description>
        <div className="mt-auto flex items-center justify-end gap-2">
          <button className={btnPrimary} onClick={handleCloseDialog}>
            Finish
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Dialog.Description className="space-y-1 text-zinc-500">
        <span className="block">
          <strong className="text-blue-500">{closedAccounts.length}</strong> token accounts were
          succesfully closed.
        </span>
      </Dialog.Description>
      <div className="mt-auto flex items-center justify-end gap-2">
        <button className={btnPrimary} onClick={handleCloseDialog}>
          Finish
        </button>
      </div>
    </>
  );
};
