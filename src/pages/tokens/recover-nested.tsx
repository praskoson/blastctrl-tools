import { ChevronRightIcon } from "@heroicons/react/24/solid";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction } from "@solana/web3.js";
import { NextPage } from "next";
import Head from "next/head";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { assert, classNames, zipMap } from "utils";
import {
  compress,
  isPublicKey,
  lamportsToSol,
  lamportsToSolString,
  normalizeTokenAmount,
} from "utils/spl/common";
import { createRecoverNestedTokenAccountInstruction } from "utils/spl/token";
import {
  AccountLayout,
  getAssociatedTokenAddressSync,
  RawAccount,
  Mint,
  getMint,
} from "@solana/spl-token-next";
import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ArrowPathIcon, CheckCircleIcon } from "@heroicons/react/20/solid";
import useUserSOLBalanceStore from "stores/useUserSOLBalanceStore";

type FormValues = {
  parentAta: string;
  nestedAta: string;
  destinationAta: string;
};

type AccountInfo = {
  address: PublicKey;
  data: RawAccount;
  executable: boolean;
  owner: PublicKey;
  lamports: number;
  rentEpoch?: number;
};

const RecoverNested: NextPage = () => {
  const { connection } = useConnection();
  const { balance, getUserSOLBalance } = useUserSOLBalanceStore();
  const { publicKey: wallet, connected, sendTransaction } = useWallet();
  const [openDialog, setOpenDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const [parentInfo, setParentInfo] = useState<AccountInfo>(null);
  const [nestedInfo, setNestedInfo] = useState<AccountInfo>(null);
  const [destinationInfo, setDestinationInfo] = useState<AccountInfo>(null);
  const [mintInfo, setMintInfo] = useState<Mint>(null);

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

  useEffect(() => {
    getUserSOLBalance(wallet, connection);
  }, [connection, wallet, getUserSOLBalance]);

  const onSubmit = async (data: FormValues) => {
    if (!connected) {
      toast.error("Connect your wallet");
      return;
    }

    setIsProcessing(true);
    const parentAta = new PublicKey(data.parentAta);
    const nestedAta = new PublicKey(data.nestedAta);
    let destinationAta: PublicKey;
    setParentInfo(null);
    setNestedInfo(null);
    setDestinationInfo(null);
    let parentAtaInfo: AccountInfo;
    let nestedAtaInfo: AccountInfo;
    let destinationInfo: AccountInfo;
    let mintInfo: Mint;

    try {
      const infos = await connection.getMultipleAccountsInfo([parentAta, nestedAta]);
      const accounts = zipMap([parentAta, nestedAta], infos, (address, info) => ({
        ...info,
        address,
      }));

      [parentAtaInfo, nestedAtaInfo] = accounts.map(({ data, ...rest }) => ({
        ...rest,
        data: AccountLayout.decode(data, 0),
      }));

      destinationAta = getAssociatedTokenAddressSync(nestedAtaInfo.data.mint, wallet, true);
      const { data, ...rest } = await connection.getAccountInfo(destinationAta);
      destinationInfo = {
        address: destinationAta,
        ...rest,
        data: AccountLayout.decode(data, 0),
      };
      mintInfo = await getMint(connection, nestedAtaInfo.data.mint);
    } catch (err) {
      toast.error("Error loading token account info. Are these valid token accounts?");
      setIsProcessing(false);
      return;
    }

    // Assertions
    try {
      const actualParentAta = getAssociatedTokenAddressSync(
        parentAtaInfo.data.mint,
        parentAtaInfo.data.owner,
        true
      );
      assert(
        parentAta.equals(actualParentAta),
        `Not a valid ATA. Expected: ${actualParentAta.toBase58()}, actual: ${parentAta.toBase58()}`
      );

      const actualNestedAta = getAssociatedTokenAddressSync(
        nestedAtaInfo.data.mint,
        nestedAtaInfo.data.owner,
        true
      );
      assert(
        actualNestedAta.equals(nestedAta),
        `Not a valid ATA. Expected: ${actualNestedAta.toBase58()}, actual: ${nestedAta.toBase58()}`
      );

      assert(
        nestedAtaInfo.data.owner.equals(parentAta),
        `Nested ATA is not owned by parent. Expected: ${nestedAtaInfo.data.owner.toBase58()}, actual: ${parentAta.toBase58()}`
      );

      assert(
        destinationInfo.data.mint.equals(nestedAtaInfo.data.mint),
        `Destination and nested account's mint addresses do not match. Nested: ${nestedAtaInfo.data.mint.toBase58()}, destination: ${
          destinationInfo.data.mint.toBase58
        }`
      );

      setParentInfo(parentAtaInfo);
      setNestedInfo(nestedAtaInfo);
      setDestinationInfo(destinationInfo);
      setMintInfo(mintInfo);
    } catch (err) {
      console.log(err);
      toast.error(err?.message);
      setIsProcessing(false);
      return;
    }

    setOpenDialog(true);
    setIsProcessing(false);
  };

  const handleRecover = async () => {
    if (!connected) {
      toast.error("Connect your wallet");
      return;
    }

    try {
      const {
        context: { slot: minContextSlot },
        value: { blockhash, lastValidBlockHeight },
      } = await connection.getLatestBlockhashAndContext();
      const tx = new Transaction().add(
        createRecoverNestedTokenAccountInstruction(
          wallet,
          nestedInfo.address,
          nestedInfo.data.mint,
          destinationInfo.address,
          parentInfo.address,
          parentInfo.data.mint
        )
      );
      setConfirming(true);
      const signature = await sendTransaction(tx, connection, { minContextSlot });
      console.log(signature);
      await connection.confirmTransaction({ blockhash, lastValidBlockHeight, signature });
      toast.success(
        `Transaction success, recovered ${normalizeTokenAmount(
          Number(nestedInfo.data.amount),
          mintInfo.decimals
        )} tokens.`
      );
    } catch (err) {
      console.log(err);
      toast.error("Error confirming Recover nested, check the console for more details.");
    } finally {
      setNestedInfo(null);
      setDestinationInfo(null);
      setParentInfo(null);
      setMintInfo(null);
      setConfirming(false);
      setOpenDialog(false);
    }
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
            Enter the addresses of both the &quot;parent&quot;{" "}
            <abbr title="Associated Token Account">ATA</abbr> and the nested ATA to recover funds.
            The nested account will be deleted and its tokens will be transferred to your ATA of the
            same mint as the nested account, while the rent will be transferred to your wallet.
          </p>
        </div>

        <div className="my-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-y-6 gap-x-2 border-b border-gray-200 pb-6 sm:grid-cols-6 ">
              <div className="relative mt-1 sm:col-span-6">
                <label className="mb-1 block text-sm font-medium text-gray-600" htmlFor="parentAta">
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
                <label className="mb-1 block text-sm font-medium text-gray-600" htmlFor="nestedAta">
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
                  className="inline-flex items-center rounded-md border border-gray-300 bg-transparent px-4 py-2 text-base text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
                >
                  Clear
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="inline-flex items-center rounded-md border border-transparent bg-secondary px-4 py-2 text-base text-gray-50 shadow-sm hover:bg-secondary-focus focus:outline-none focus:ring-2 focus:ring-secondary-focus focus:ring-offset-2"
                >
                  {isProcessing ? (
                    <>
                      <ArrowPathIcon className="-ml-2 mr-1 h-5 w-5 animate-spin" />
                      Confirming
                    </>
                  ) : (
                    <>
                      <ChevronRightIcon className="-ml-2 mr-1 h-5 w-5" aria-hidden={true} />
                      Recover
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <Transition.Root show={openDialog} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={confirming ? () => {} : setOpenDialog}>
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
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-xl sm:p-6">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                      <CheckCircleIcon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                        Recover nested account available
                      </Dialog.Title>
                      {wallet && nestedInfo && parentInfo && mintInfo && destinationInfo && (
                        <div className="flex flex-col gap-y-6">
                          <div className="my-3">
                            <p className="text-left text-sm text-gray-600">
                              Balance changes after recovering
                            </p>
                            <div className="mt-4 flex-col">
                              <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                                  <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                                    <table className="min-w-full divide-y divide-gray-300">
                                      <thead className="bg-gray-50">
                                        <tr>
                                          {["Address", "Token", "Change", "Post Balance"].map(
                                            (col) => (
                                              <th
                                                key={col}
                                                className="whitespace-nowrap px-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900"
                                                scope="col"
                                              >
                                                {col}
                                              </th>
                                            )
                                          )}
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-gray-200 bg-white">
                                        <tr>
                                          <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-6">
                                            {compress(wallet?.toBase58(), 4)}
                                          </td>
                                          <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-6">
                                            ◎ SOL
                                          </td>
                                          <td>
                                            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                              +{lamportsToSolString(nestedInfo.lamports - 5000)}
                                            </span>
                                          </td>
                                          <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-6">
                                            {balance + lamportsToSol(nestedInfo.lamports)}
                                          </td>
                                        </tr>
                                        <tr>
                                          <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-6">
                                            {compress(destinationInfo.address.toBase58(), 4)}
                                          </td>
                                          <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-6">
                                            {compress(destinationInfo.data.mint.toBase58(), 4)}
                                          </td>
                                          <td>
                                            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                              +
                                              {normalizeTokenAmount(
                                                Number(nestedInfo.data.amount),
                                                mintInfo.decimals
                                              )}
                                            </span>
                                          </td>
                                          <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-6">
                                            {normalizeTokenAmount(
                                              (
                                                destinationInfo.data.amount + nestedInfo.data.amount
                                              ).toString(),
                                              mintInfo.decimals
                                            )}
                                          </td>
                                        </tr>
                                        <tr>
                                          <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-6">
                                            {compress(nestedInfo.address.toBase58(), 4)}
                                          </td>
                                          <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-6">
                                            ◎ SOL
                                          </td>
                                          <td>
                                            <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                                              -{lamportsToSol(nestedInfo.lamports)}
                                            </span>
                                          </td>
                                          <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-6">
                                            0
                                          </td>
                                        </tr>
                                        <tr>
                                          <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-6">
                                            {compress(nestedInfo.address.toBase58(), 4)}
                                          </td>
                                          <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-6">
                                            {compress(nestedInfo.data.mint.toBase58(), 4)}
                                          </td>
                                          <td>
                                            <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                                              -
                                              {normalizeTokenAmount(
                                                nestedInfo.data.amount.toString(),
                                                mintInfo.decimals
                                              )}
                                            </span>
                                          </td>
                                          <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-6">
                                            0
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      disabled={confirming}
                      className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={handleRecover}
                    >
                      {confirming && <ArrowPathIcon className="-ml-2 mr-1 h-5 w-5 animate-spin" />}
                      {confirming ? "Confirming" : "Recover"}
                    </button>
                    <button
                      type="button"
                      disabled={confirming}
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
