import {
  ArrowPathIcon,
  ChevronRightIcon,
  ExclamationCircleIcon,
  PlusCircleIcon,
  QuestionMarkCircleIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import {
  CreateNftInput,
  Metaplex,
  toBigNumber,
  walletAdapterIdentity,
} from "@metaplex-foundation/js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { InputGroup } from "components/InputGroup";
import type { NextPage } from "next";
import Head from "next/head";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { isPublicKey } from "utils/spl/common";

import { Switch } from "@headlessui/react";
import { PublicKey } from "@solana/web3.js";
import { notify } from "components/Notification";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { classNames } from "utils";
import { MAX_CREATORS } from "./update";
import { WalletError } from "@solana/wallet-adapter-base";

export type CreateFormInputs = {
  name: string;
  symbol: string;
  uri: string;
  updateAuthority: string;
  isMutable: boolean;
  primarySaleHappened: boolean;
  creators: {
    address: string;
    share: number;
  }[];
  sellerFeeBasisPoints: number;
  isCollection: boolean;
  collectionIsSized: boolean;
  maxSupply: number;
};

const Mint: NextPage = () => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const router = useRouter();
  const [isConfirming, setIsConfirming] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, dirtyFields },
    setValue,
    watch,
    setFocus,
  } = useForm<CreateFormInputs>({
    mode: "onSubmit",
    defaultValues: {
      name: "",
      symbol: "",
      uri: "",
      isMutable: true,
      primarySaleHappened: false,
      creators: [],
      sellerFeeBasisPoints: null,
      isCollection: false,
      collectionIsSized: false,
      maxSupply: 0,
    },
  });
  const watchedIsCollection = watch("isCollection");

  const { fields, append, remove } = useFieldArray({
    control,
    name: "creators",
    rules: {
      maxLength: MAX_CREATORS,
      minLength: 0,
    },
  });

  const isCreatorAddable = fields.length < MAX_CREATORS;

  useEffect(() => {
    const query = router.query;
    if (query?.isCollection) {
      setValue("isCollection", true);
      setFocus("isCollection");
      window.scrollBy(0, 200);
    }
    if (query?.collectionIsSized) {
      setValue("collectionIsSized", true);
    }
  }, [router.query, setValue, setFocus]);

  const submit = async (data: CreateFormInputs) => {
    if (!wallet.connected) {
      notify({ type: "error", description: "Connect your wallet", title: "Connect your wallet" });
      return;
    }

    setIsConfirming(true);
    const metaplex = Metaplex.make(connection).use(walletAdapterIdentity(wallet));
    const { name, symbol, uri, isMutable, maxSupply, isCollection, collectionIsSized } = data;
    const createNftInput: CreateNftInput = {
      name,
      symbol,
      uri,
      isMutable,
      isCollection,
      collectionIsSized,
      maxSupply: toBigNumber(maxSupply),
      creators: dirtyFields.creators
        ? data.creators.map(({ address, share }) => ({
            address: new PublicKey(address),
            share,
            authority: address === wallet.publicKey.toBase58() ? wallet : undefined,
          }))
        : undefined,
      sellerFeeBasisPoints: dirtyFields.sellerFeeBasisPoints
        ? data.sellerFeeBasisPoints
        : undefined,
    };

    try {
      const { response } = await metaplex.nfts().create(createNftInput);
      console.log(response);
      notify({
        title: "NFT mint successful",
        description: (
          <>
            The <span className="font-medium text-blue-300">{name}</span> NFT has been minted to
            your wallet.
          </>
        ),
        type: "success",
        txid: response.signature,
      });
    } catch (err) {
      if (err instanceof WalletError) {
        // The onError callback in the walletconnect context will handle it
        return;
      }
      console.log({ err });
      notify({ type: "error", title: "Error minting", description: err?.problem });
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <>
      <Head>
        <title>BlastCtrl Tools - Mint NFT</title>
        <meta name="Metaplex NFT" content="Basic Functionality" />
      </Head>
      <div className="mx-auto max-w-xl overflow-visible bg-white px-4 pb-5 sm:mb-6 sm:rounded-lg sm:p-6 sm:shadow">
        <div className="border-b border-gray-200 pb-4">
          <h1 className="mb-4 font-display text-3xl font-semibold">NFT minting</h1>
          <p className="text-sm text-gray-500">
            Enter the on-chain values you wish your NFT to have. It will be minted to your wallet,
            with your address as its update authority.
          </p>
        </div>

        <form onSubmit={handleSubmit(submit)} className="space-y-8 divide-y divide-gray-200">
          <div>
            <div className="mt-4">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Basic Information</h3>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <InputGroup
                  label="Name"
                  register={register("name", {
                    maxLength: {
                      value: 32,
                      message: "Max name length is 32",
                    },
                    required: true,
                  })}
                  error={errors?.name}
                />
              </div>

              <div className="sm:col-span-2">
                <InputGroup
                  label="Symbol"
                  register={register("symbol", {
                    maxLength: {
                      value: 10,
                      message: "Max symbol length is 10",
                    },
                  })}
                  error={errors?.symbol}
                />
              </div>

              <div className="sm:col-span-6">
                <InputGroup
                  label="URI"
                  register={register("uri", {
                    maxLength: {
                      value: 200,
                      message: "Max URI length is 200",
                    },
                  })}
                  error={errors?.uri}
                />
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="maxSupply" className="flex items-end gap-x-2 text-sm">
                  <span className="font-medium text-gray-700">Max supply</span>
                  <span className="text-xs font-normal text-gray-500">
                    Used for printing editions
                  </span>
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="maxSupply"
                    className={classNames(
                      "block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
                      !!errors.maxSupply &&
                        "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500"
                    )}
                    aria-invalid={errors.maxSupply ? "true" : "false"}
                    {...register("maxSupply", { min: { value: 0, message: "Minimum is 0" } })}
                  />
                </div>
                {errors.maxSupply && (
                  <p className="mt-2 text-sm text-red-600">{errors.maxSupply.message}</p>
                )}
              </div>
            </div>
          </div>

          <div>
            <div className="mt-4">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Creators</h3>
              <p className="mt-1 text-sm text-gray-500">
                There can be up to 5 creators. The shares must add up to 100. Creators other than
                yourself will be unverified.
                <a
                  href="https://docs.metaplex.com/programs/token-metadata/accounts#creators"
                  rel="noreferrer"
                  target="_blank"
                >
                  <QuestionMarkCircleIcon className="ml-1 inline h-4 w-4 text-gray-400" />
                </a>
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-6">
                <div className="flex flex-col gap-y-2">
                  {fields.map((field, idx) => (
                    <fieldset key={field.id}>
                      <legend className="sr-only">Creator address and share</legend>
                      <div className="mt-1 -space-y-px rounded-md bg-white shadow-sm">
                        <div className="grid grid-cols-9 -space-x-px">
                          {idx === 0 && (
                            <>
                              <label className="col-span-6 mb-1 pl-1 text-sm text-gray-600">
                                Creator address
                              </label>
                              <label className="col-span-3 mb-1 pl-1 text-sm text-gray-600">
                                Share
                              </label>
                            </>
                          )}
                          <div className="col-span-6 flex-1">
                            <label className="sr-only">Creator</label>
                            <input
                              type="text"
                              {...register(`creators.${idx}.address` as const, {
                                required: true,
                                validate: {
                                  pubkey: isPublicKey,
                                },
                              })}
                              defaultValue=""
                              className={classNames(
                                "relative block w-full rounded-none rounded-bl-md rounded-tl-md border-gray-300 bg-transparent pr-6",
                                "focus:z-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
                                errors?.creators?.[idx]?.address &&
                                  "border-red-500 focus:border-red-600 focus:ring-red-500"
                              )}
                              placeholder="Creator address"
                            />
                          </div>
                          <div className="col-span-2 flex-1">
                            <label className="sr-only">Share</label>
                            <input
                              type="number"
                              {...register(`creators.${idx}.share` as const, {
                                required: true,
                                min: 0,
                                max: 100,
                              })}
                              className={classNames(
                                "relative block w-full rounded-none border-gray-300 bg-transparent",
                                "focus:z-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
                                errors?.creators?.[idx]?.share &&
                                  "border-red-500 focus:border-red-600 focus:ring-red-500"
                              )}
                              placeholder="Share"
                            />
                          </div>
                          <div className="col-span-1">
                            <label className="sr-only">Remove creator</label>
                            <button
                              className="inline-flex h-full w-full items-center justify-center rounded-none rounded-tr-md rounded-br-md border border-gray-300 bg-red-500"
                              type="button"
                              onClick={() => remove(idx)}
                            >
                              <XMarkIcon className="h-5 w-5 font-semibold text-white" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </fieldset>
                  ))}
                  <div className="mt-2">
                    {isCreatorAddable && (
                      <button
                        onClick={() => append({ address: "", share: 0 })}
                        type="button"
                        className="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        Add Creator
                        <PlusCircleIcon className="ml-3 -mr-1 h-5 w-5" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label
                  htmlFor="sellerFeeBasisPoints"
                  className="block text-sm font-medium text-gray-700"
                >
                  Royalties{" "}
                  <code className="prose text-sm tracking-tighter">
                    (sellerFeeBasisPoints [0-10000])
                  </code>
                </label>
                <div className="relative mt-1">
                  <input
                    id="sellerFeeBasisPoints"
                    type="number"
                    {...register("sellerFeeBasisPoints", {
                      min: 0,
                      max: 10000,
                      valueAsNumber: true,
                      required: true,
                    })}
                    className={classNames(
                      "block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
                      errors?.sellerFeeBasisPoints &&
                        "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500"
                    )}
                    aria-invalid={errors?.sellerFeeBasisPoints ? "true" : "false"}
                  />
                  {errors?.sellerFeeBasisPoints && (
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                    </div>
                  )}
                </div>
                {errors?.sellerFeeBasisPoints && (
                  <p className="mt-2 text-sm text-red-600" id={errors.sellerFeeBasisPoints.type}>
                    Seller fee must be between 0 and 1000
                  </p>
                )}
              </div>
            </div>
          </div>

          <div>
            <div className="mt-4">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Flags</h3>
              <p className="mt-1 text-sm text-gray-500">
                Flags control certain properties of your token.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-5">
                <Switch.Group as="div" className="flex items-center justify-between">
                  <span className="flex flex-grow flex-col">
                    <Switch.Label as="span" className="text-sm font-medium text-gray-900" passive>
                      Is mutable
                    </Switch.Label>
                    <Switch.Description as="span" className="text-sm text-gray-500">
                      If this flag is changed to false, it wont be possible to change the metadata
                      anymore.
                    </Switch.Description>
                  </span>
                  <Controller
                    control={control}
                    name="isMutable"
                    render={({ field: { value, ...rest } }) => (
                      <Switch
                        {...rest}
                        className={classNames(
                          value ? "bg-indigo-600" : "bg-gray-200",
                          "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        )}
                      >
                        <span
                          aria-hidden="true"
                          className={classNames(
                            value ? "translate-x-5" : "translate-x-0",
                            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                          )}
                        />
                      </Switch>
                    )}
                  />
                </Switch.Group>
              </div>

              <div className="sm:col-span-5">
                <Switch.Group as="div" className="flex items-center justify-between">
                  <span className="flex flex-grow flex-col">
                    <Switch.Label as="span" className="text-sm font-medium text-gray-900" passive>
                      Is Collection
                    </Switch.Label>
                    <Switch.Description as="span" className="text-sm text-gray-500">
                      Does this token represent a collection NFT?
                      <a
                        href="https://docs.metaplex.com/programs/token-metadata/certified-collections"
                        rel="noreferrer"
                        target="_blank"
                      >
                        <QuestionMarkCircleIcon className="mb-0.5 ml-2 inline h-4 w-4 text-gray-400" />
                      </a>
                    </Switch.Description>
                  </span>
                  <Controller
                    control={control}
                    name="isCollection"
                    rules={{
                      onChange: (e) => !e.target.value && setValue("collectionIsSized", false),
                    }}
                    render={({ field: { value, ...rest } }) => (
                      <Switch
                        {...rest}
                        className={classNames(
                          value ? "bg-indigo-600" : "bg-gray-200",
                          "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        )}
                      >
                        <span
                          aria-hidden="true"
                          className={classNames(
                            value ? "translate-x-5" : "translate-x-0",
                            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                          )}
                        />
                      </Switch>
                    )}
                  />
                </Switch.Group>
              </div>

              <div className="sm:col-span-5">
                <Switch.Group as="div" className="flex items-center justify-between">
                  <span className="flex flex-grow flex-col">
                    <Switch.Label as="span" className="text-sm font-medium text-gray-900" passive>
                      Is a sized collection
                    </Switch.Label>
                    <Switch.Description as="span" className="text-sm text-gray-500">
                      Is this a &quot;sized&quot; collection NFT?
                      <a
                        href="https://docs.metaplex.com/programs/token-metadata/certified-collections"
                        rel="noreferrer"
                        target="_blank"
                      >
                        <QuestionMarkCircleIcon className="ml-2 mb-0.5 inline h-4 w-4 text-gray-400" />
                      </a>
                    </Switch.Description>
                  </span>

                  <Controller
                    control={control}
                    name="collectionIsSized"
                    render={({ field: { value, ...rest } }) => (
                      <Switch
                        {...rest}
                        disabled={!watchedIsCollection}
                        className={classNames(
                          value ? "bg-indigo-600" : "bg-gray-200",
                          "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        )}
                      >
                        <span
                          aria-hidden="true"
                          className={classNames(
                            value ? "translate-x-5" : "translate-x-0",
                            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                          )}
                        />
                      </Switch>
                    )}
                  />
                </Switch.Group>
              </div>
            </div>
          </div>

          <div className="pt-5">
            <div className="flex justify-end gap-2">
              <button
                onClick={() => reset()}
                type="button"
                className="inline-flex items-center rounded-md bg-secondary/20 px-4 py-2 text-base text-secondary shadow-sm hover:bg-secondary/30 focus:outline-none focus:ring-2 focus:ring-secondary-focus focus:ring-offset-2"
              >
                Clear inputs
              </button>
              <button
                type="submit"
                className="inline-flex items-center rounded-md bg-secondary px-4 py-2 text-base text-gray-50 shadow-sm hover:bg-secondary-focus focus:outline-none focus:ring-2 focus:ring-secondary-focus focus:ring-offset-2"
              >
                {isConfirming ? (
                  <>
                    <ArrowPathIcon className="-ml-1 mr-2 h-5 w-5 animate-spin" />
                    Confirming
                  </>
                ) : (
                  <>
                    <ChevronRightIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden={true} />
                    Mint
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Mint;
