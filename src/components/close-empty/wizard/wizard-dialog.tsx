import { Dialog } from "@headlessui/react";
import { ParsedTokenAccount } from "lib/query/use-owner-assets";
import { cn } from "lib/utils";
import { SimulateStep } from "./simulate-step";
import { CloseAccountsProvider, useCloseAccountsStore } from "./wizard-context";
import { SignStep } from "./sign-step";
import { FinalStep } from "./final-step";

type Props = {
  open: boolean;
  onClose: () => void;
  accountsToClose: ParsedTokenAccount[];
};

export function CloseAccountWizard({ accountsToClose, open, onClose }: Props) {
  return (
    <CloseAccountsProvider closeDialog={onClose} initialAccounts={accountsToClose}>
      <Dialog open={open} onClose={() => {}}>
        <div className="pointer-events-none fixed inset-0 z-[50] bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 z-[50] flex w-screen items-center justify-center">
          <Dialog.Panel className="mx-5 h-[300px] w-full max-w-[536px] rounded-lg bg-white p-4 shadow-lg sm:mx-auto">
            <div className="flex size-full flex-col gap-4">
              <DialogTitle />
              <DialogContent />
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </CloseAccountsProvider>
  );
}

const DialogTitle = () => {
  return (
    <Dialog.Title className="flex flex-col gap-6 pb-4">
      <span className="font-bold">Account Cleanup Checkout</span>
      <div className="flex w-full justify-around gap-2">
        <Step step={0} />
        <Step step={1} />
        <Step step={2} />
      </div>
    </Dialog.Title>
  );
};

const Step = ({ step }: { step: number }) => {
  const currentStep = useCloseAccountsStore((store) => store.currentStep);
  const error = useCloseAccountsStore((store) => store.error);

  return (
    <div
      className={cn(
        "flex size-10 items-center justify-center rounded-full text-2xl font-medium ring-4 transition-colors",
        {
          "text-zinc-300 ring-zinc-200": step > currentStep,
          "text-blue-500 ring-blue-500": step === currentStep && error === null,
          "text-red-500 ring-red-400": step === currentStep && !!error,
          "bg-blue-500 text-white ring-blue-300": step < currentStep,
        },
      )}
    >
      {step + 1}
    </div>
  );
};

const DialogContent = () => {
  const currentStep = useCloseAccountsStore((store) => store.currentStep);

  if (currentStep === 0) {
    return <SimulateStep />;
  }

  if (currentStep === 1) {
    return <SignStep />;
  }

  if (currentStep === 2) {
    return <FinalStep />;
  }

  return <div className="flex size-full items-center justify-center text-2xl">🤔</div>;
};
