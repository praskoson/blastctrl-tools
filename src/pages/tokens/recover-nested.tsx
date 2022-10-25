import { ChevronRightIcon, ExclamationCircleIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { NextPage } from "next";
import Head from "next/head";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { assert, classNames } from "utils";
import { isPublicKey } from "utils/spl/common";
import { createRecoverNestedTokenAccountInstruction } from "utils/spl/token";
import {
  Account,
  getMultipleAccounts,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token-next";
import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ArrowPathIcon, CheckCircleIcon } from "@heroicons/react/20/solid";

type FormValues = {
  parentAta: string;
  nestedAta: string;
};

const RecoverNested: NextPage = () => {
  const { connection } = useConnection();
  const { publicKey: wallet, connected } = useWallet();
  const [openDialog, setOpenDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [parentInfo, setParentInfo] = useState<Account>(null);
  const [nestedInfo, setNestedInfo] = useState<Account>(null);

  const {
    register,
    reset,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      parentAta: "",
      nestedAta: "",
    },
  });

  const onRecover = async (data: FormValues) => {
    if (!connected) {
      toast.error("Connect your wallet");
      return;
    }

    setIsProcessing(true);
    const parentAta = new PublicKey(data.parentAta);
    const nestedAta = new PublicKey(data.nestedAta);
    setParentInfo(null);
    setNestedInfo(null);
    let parentAtaInfo: Account;
    let nestedAtaInfo: Account;

    try {
      [parentAtaInfo, nestedAtaInfo] = await getMultipleAccounts(
        connection,
        [parentAta, nestedAta],
        "confirmed"
      );
    } catch (err) {
      toast.error("Error loading token account info. Are these valid token accounts?");
      setIsProcessing(false);
      return;
    }

    // Assertions
    try {
      const actualParentAta = getAssociatedTokenAddressSync(
        parentAtaInfo.mint,
        parentAtaInfo.owner
      );
      assert(
        parentAta.equals(actualParentAta),
        `Not a valid ATA. Expected: ${actualParentAta.toBase58()}, actual: ${parentAta.toBase58()}`
      );

      const actualNestedAta = getAssociatedTokenAddressSync(
        nestedAtaInfo.mint,
        nestedAtaInfo.owner
      );
      assert(
        actualNestedAta.equals(nestedAta),
        `Not a valid ATA. Expected: ${actualNestedAta.toBase58()}, actual: ${nestedAta.toBase58()}`
      );

      assert(
        nestedAtaInfo.owner.equals(parentAta),
        `Nested ATA is not owned by parent. Expected: ${nestedAtaInfo.owner.toBase58()}, actual: ${parentAta.toBase58()}`
      );

      setParentInfo(parentAtaInfo);
      setNestedInfo(nestedAtaInfo);
    } catch (err) {
      toast.error(err?.message);
      setIsProcessing(false);
      return;
    }

    setOpenDialog(true);
  };

  return (
    <>
      <Head>
        <title>Tools | Blast Ctrl - Recover Nested</title>
        <meta name="Metaplex NFT" content="Basic Functionality" />
      </Head>
      <div className="mx-auto max-w-xl overflow-visible bg-white px-4 pb-5 sm:mb-6 sm:rounded-lg sm:p-6 sm:shadow">
        <div className="border-b border-gray-200 pb-4">
          <h1 className="mb-4 font-display text-3xl font-semibold">
            Recover Nested Token Accounts
          </h1>
          <p className="text-sm text-gray-500">
            Enter the addresses of both the &quot;parent&quot; ATA and the nested ATA to recover
            funds. The nested account will be deleted and tokens transferred to the parent ATA.
          </p>
        </div>

        <div className="my-6">
          <form onSubmit={handleSubmit(onRecover)}>
            <div className="grid gap-y-6 border-b border-gray-200 pb-6 sm:grid-cols-6 ">
              <div className="relative mt-1 sm:col-span-6">
                <label className="mb-1 block text-sm font-medium text-gray-500" htmlFor="parentAta">
                  Parent associated token account
                </label>
                <input
                  id="parentAta"
                  className={classNames(
                    "block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
                    !!errors?.parentAta &&
                      "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500"
                  )}
                  aria-invalid={errors?.parentAta ? "true" : "false"}
                  {...register("parentAta", {
                    required: true,
                    validate: (value) => isPublicKey(value) || "Not a valid pubkey",
                  })}
                  type="text"
                />
                {errors?.parentAta && (
                  <p className="mt-2 text-sm text-red-600" id={errors?.parentAta.type}>
                    {errors?.parentAta.message}
                  </p>
                )}
              </div>

              <div className="relative mt-1 sm:col-span-6">
                <label className="mb-1 block text-sm font-medium text-gray-500" htmlFor="nestedAta">
                  Nested associated token account
                </label>
                <input
                  id="nestedAta"
                  className={classNames(
                    "block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
                    !!errors?.nestedAta &&
                      "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500"
                  )}
                  aria-invalid={errors?.nestedAta ? "true" : "false"}
                  {...register("nestedAta", {
                    required: true,
                    validate: {
                      pubkey: (value) => isPublicKey(value) || "Not a valid pubkey",
                      notEqualToParent: (value) => {
                        const { parentAta } = getValues();
                        return (
                          value !== parentAta || "Parent and nested ATA should not be the same"
                        );
                      },
                    },
                  })}
                  type="text"
                />
                {errors?.nestedAta && (
                  <p className="mt-2 text-sm text-red-600" id={errors?.nestedAta.type}>
                    {errors?.nestedAta.message}
                  </p>
                )}
              </div>
            </div>

            <div className="my-6">
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => reset()}
                  className="inline-flex items-center rounded-md bg-secondary/20 px-4 py-2 text-base text-secondary shadow-sm hover:bg-secondary/30 focus:outline-none focus:ring-2 focus:ring-secondary-focus focus:ring-offset-2"
                >
                  Clear
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="inline-flex items-center rounded-md bg-secondary px-4 py-2 text-base text-gray-50 shadow-sm hover:bg-secondary-focus focus:outline-none focus:ring-2 focus:ring-secondary-focus focus:ring-offset-2"
                >
                  {isProcessing ? (
                    <ArrowPathIcon className="-ml-2 mr-1 h-5 w-5 animate-spin" />
                  ) : (
                    <ChevronRightIcon className="-ml-2 mr-1 h-5 w-5" aria-hidden={true} />
                  )}
                  Recover
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <Transition.Root show={openDialog} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpenDialog}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div className="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
                    <button
                      type="button"
                      className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={() => setOpenDialog(false)}
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <CheckCircleIcon
                        className="h-6 w-6 text-indigo-600"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                        Deactivate account
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Are you sure you want to deactivate your account? All of your data will be
                          permanently removed from our servers forever. This action cannot be
                          undone.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={() => setOpenDialog(false)}
                    >
                      Recover
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                      onClick={() => setOpenDialog(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};

export default RecoverNested;
