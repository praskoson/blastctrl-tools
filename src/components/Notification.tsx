import { ReactNode, useEffect, useMemo, useState } from "react";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { ArrowPathIcon, XMarkIcon } from "@heroicons/react/20/solid";
import useQueryContext from "hooks/useQueryContext";
import toast, { resolveValue, ValueOrFunction } from "react-hot-toast";
import { classNames } from "utils";
import { SpinnerIcon } from "./SpinnerIcon";
import { Transaction } from "@solana/web3.js";

export type NotifyProps = {
  type?: "error" | "success" | "loading" | "info" | null | undefined;
  title?: string | ReactNode;
  description?: string | ReactNode;
  txid?: string;
};
export type NotifyWithPromisesProps<T> = {
  title?: ReactNode;
  promises: Promise<PromiseSettledResult<Awaited<T>>[]>;
  strategy: "parallel" | "sequential";
};
export type NotificationWindowProps = NotifyProps & { visible: boolean; onClose: () => void };
export type NotificationWindowWithPromisesProps<T> = NotifyWithPromisesProps<T> & {
  visible: boolean;
  onClose: () => void;
};

export function NotificationWindow({
  type,
  title,
  description,
  txid,
  visible,
  onClose,
}: NotificationWindowProps) {
  const { fmtUrlWithCluster } = useQueryContext();

  const iconMemo = useMemo(() => {
    switch (type) {
      case "success":
        return <CheckCircleIcon className="h-7 w-7 text-emerald-500" aria-hidden="true" />;
      case "error":
        return <ExclamationTriangleIcon className="h-7 w-7 text-amber-600" aria-hidden="true" />;
      case "loading":
        return <SpinnerIcon className="h-6 w-6 animate-spin text-white" aria-hidden="true" />;
      case "info":
        return <InformationCircleIcon className="h-7 w-7 text-cyan-400" aria-hidden="true" />;
      default:
        return null;
    }
  }, [type]);

  const linkMemo = useMemo(
    () => (
      <a
        rel="noreferrer"
        target="_blank"
        className="rounded-md text-gray-200 underline underline-offset-2 hover:text-gray-50"
        href={fmtUrlWithCluster(`https://solscan.io/tx/${txid}`)}
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
          {iconMemo && <div className="mt-1 flex-shrink-0">{iconMemo}</div>}
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className="text-lg font-semibold tracking-wide text-gray-50">{title}</p>
            <div className="mt-1 text-sm text-gray-300">{description}</div>
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

export const notify = (props: NotifyProps, id?: string) => {
  return toast.custom(
    (t) => (
      <NotificationWindow {...props} visible={t.visible} onClose={() => toast.dismiss(t.id)} />
    ),
    { duration: props.type === "loading" ? Infinity : 20000, id }
  );
};

export const notifyPromise = <T,>(
  promise: Promise<T>,
  msgs: {
    loading: NotifyProps;
    success: ValueOrFunction<NotifyProps, T>;
    error: ValueOrFunction<NotifyProps, any>;
  }
) => {
  const id = notify({ type: "loading", ...msgs.loading });

  promise
    .then((value) => {
      const result = resolveValue(msgs.success, value);
      notify({ type: "success", ...result }, id);
    })
    .catch((err) => {
      const result = resolveValue(msgs.error, err);
      notify({ type: "error", ...result }, id);
    });

  return promise;
};

type PromiseState = "pending" | "confirmed" | "rejected";

export const notifyManyPromises = <T,>({
  title,
  promises,
}: {
  title: ReactNode;
  promises: { label: string; promise: Promise<T>; txid: string }[];
}) => {
  const states: { state: PromiseState; label: string; txid: string }[] = Array(promises.length);
  for (let i = 0; i < promises.length; i++) {
    states[i] = { state: "pending", label: promises[i].label, txid: promises[i].txid };
  }
  const id = notify({ title, description: <StateComponent states={states} /> });

  const getTitle = (states: { state: PromiseState; label: ReactNode }[]) => {
    if (states.some((state) => state.state === "pending")) return title;
    if (states.some((state) => state.state === "rejected")) return "Confirmed with errors";
    return "Transactions confirmed";
  };

  promises.forEach(({ promise }, idx) => {
    promise
      .then(() => {
        states[idx].state = "confirmed";
        notify({ title: getTitle(states), description: <StateComponent states={states} /> }, id);
      })
      .catch(() => {
        states[idx].state = "rejected";
        notify({ title: "Error confirming transaction" });
        notify({ title: getTitle(states), description: <StateComponent states={states} /> }, id);
      });
  });
};

export const StateComponent = ({
  states,
}: {
  states: { state: PromiseState; label: ReactNode; txid: string }[];
}) => {
  const { fmtUrlWithCluster } = useQueryContext();

  return (
    <ul role="list" className="flex flex-col items-start justify-center gap-y-2">
      {states.map(({ state, label, txid }, idx) => (
        <li key={idx} className="flex items-center gap-x-2">
          {state === "pending" ? (
            <SpinnerIcon className="h-5 w-5 animate-spin text-white" aria-hidden="true" />
          ) : state === "confirmed" ? (
            <CheckCircleIcon className="h-5 w-5 text-emerald-500" aria-hidden="true" />
          ) : (
            <ExclamationTriangleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
          )}
          <div className="inline">
            <a
              rel="noreferrer"
              target="_blank"
              href={fmtUrlWithCluster(`https://solscan.io/tx/${txid}`)}
              className="font-medium underline hover:text-gray-300"
            >
              {state === "rejected" ? "Unconfirmed" : "View transaction"}
            </a>
            <span className="font-mono text-sm">: {label}</span>
            {state === "rejected" && (
              <button type="button">
                <ArrowPathIcon className="mx-1 h-5 w-5" />
              </button>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};
