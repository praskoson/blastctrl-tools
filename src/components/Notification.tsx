import { ReactNode, useMemo } from "react";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/20/solid";
import useQueryContext from "hooks/useQueryContext";
import toast from "react-hot-toast";
import { classNames } from "utils";
import { SpinnerIcon } from "./SpinnerIcon";

export const notify = (props: NotifyProps) => {
  return toast.custom(
    (t) => (
      <NotificationWindow {...props} visible={t.visible} onClose={() => toast.dismiss(t.id)} />
    ),
    { duration: props.type === "error" ? Infinity : 15000 }
  );
};

export type NotifyProps = {
  type?: "error" | "success" | "loading" | "info";
  title?: string | ReactNode;
  description?: string | ReactNode;
  txid?: string;
};

export function NotificationWindow({
  type,
  title,
  description,
  txid,
  visible,
  onClose,
}: NotifyProps & { visible: boolean; onClose: () => void }) {
  const { fmtUrlWithCluster } = useQueryContext();

  const iconMemo = useMemo(() => {
    switch (type) {
      case "success":
        return <CheckCircleIcon className="h-7 w-7 text-emerald-500" aria-hidden="true" />;
      case "error":
        return <ExclamationTriangleIcon className="h-7 w-7 text-amber-600" aria-hidden="true" />;
      case "loading":
        return <SpinnerIcon className="h-7 w-7 text-white" aria-hidden="true" />;
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
    <div
      className={classNames(
        visible ? "animate-enter" : "animate-leave",
        "pointer-events-auto mb-4 w-full max-w-sm overflow-hidden rounded-lg bg-zinc-800 shadow-lg ring-1 ring-black ring-opacity-5 sm:max-w-lg"
      )}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="mt-1 flex-shrink-0">{iconMemo}</div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className="text-xl font-semibold tracking-wide text-gray-50">{title}</p>
            <p className="mt-1 text-sm text-gray-300">{description}</p>
            {txid && <span className="block pt-4 pb-3 text-gray-200">{linkMemo}</span>}
          </div>
          <div className="ml-4 flex flex-shrink-0">
            <button
              type="button"
              className="inline-flex rounded-md bg-transparent text-gray-300 hover:text-gray-400 focus:outline-none focus:ring focus:ring-white focus:ring-offset-0"
              onClick={() => onClose()}
            >
              <span className="sr-only">Close</span>
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
