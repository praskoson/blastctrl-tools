import { Fragment, ReactNode, useMemo, useState } from "react";
import { Transition } from "@headlessui/react";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/20/solid";
import useQueryContext from "hooks/useQueryContext";
import toast from 'react-hot-toast'

// export const notify = ()

export type NotifyProps = {
  type?: "error" | "success";
  title: string | ReactNode;
  description?: string | ReactNode;
  txid?: string;
};

export default function ExampleNotify({ type, title, description, txid }: NotifyProps) {
  const [show, setShow] = useState(true);
  const { fmtUrlWithCluster } = useQueryContext();

  const iconMemo = useMemo(() => {
    switch (type) {
      case "success":
        return <CheckCircleIcon className="h-7 w-7 text-emerald-500" aria-hidden="true" />;
      case "error":
        return <ExclamationTriangleIcon className="h-7 w-7 text-amber-600" aria-hidden="true" />;
      default:
        return <InformationCircleIcon className="h-7 w-7 text-cyan-400" aria-hidden="true" />;
    }
  }, [type]);

  const linkMemo = useMemo(
    () => (
      <a
        rel="noreferrer"
        target="_blank"
        className="rounded-md text-gray-200 underline underline-offset-2 hover:text-gray-50"
        href={fmtUrlWithCluster(`https://explorer.solana.com/tx/${txid}`)}
      >
        View transaction
      </a>
    ),
    [txid, fmtUrlWithCluster]
  );

  return (
    <>
      {/* Global notification live region, render this permanently at the end of the document */}
      <div
        aria-live="assertive"
        className="pointer-events-none fixed inset-0 z-10 flex items-end px-4 py-6 sm:items-start sm:p-6"
      >
        <div className="mb-4 flex h-full w-full flex-col items-center justify-end space-y-4 sm:items-start">
          {/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}
          <Transition
            show={show}
            as={Fragment}
            enter="transform ease-out duration-300 transition"
            enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
            enterTo="translate-y-0 opacity-100 sm:translate-x-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="pointer-events-auto mb-4 w-full max-w-sm overflow-hidden rounded-lg bg-zinc-800 shadow-lg ring-1 ring-black ring-opacity-5 sm:max-w-lg">
              <div className="p-4">
                <div className="flex items-start">
                  <div className="mt-1 flex-shrink-0">{iconMemo}</div>
                  <div className="ml-3 w-0 flex-1 pt-0.5">
                    <p className="text-xl font-semibold tracking-wide text-gray-50">{title}</p>
                    <p className="mt-1 text-sm text-gray-300">
                      {description}
                    </p>
                    <div className="pt-4 pb-3 text-gray-200">{linkMemo}</div>
                  </div>
                  <div className="ml-4 flex flex-shrink-0">
                    <button
                      type="button"
                      className="inline-flex rounded-md bg-transparent text-gray-300 hover:text-gray-400 focus:outline-none focus:ring focus:ring-white focus:ring-offset-0"
                      onClick={() => {
                        setShow(false);
                      }}
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </>
  );
}
