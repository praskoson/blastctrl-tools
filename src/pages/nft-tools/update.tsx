import { NftSelector } from "components/NftSelector";
import {
  ChevronDoubleRightIcon,
  ExclamationCircleIcon,
  PlusCircleIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import type { NextPage } from "next";
import Head from "next/head";
import { SwitchButton } from "components/Switch";
import { useFieldArray, useForm } from "react-hook-form";
import { InputGroup } from "components/InputGroup";
import { isPublicKey } from "utils/spl/common";
import {
  JsonMetadata,
  Metadata,
  Metaplex,
  Nft,
  NftWithToken,
  Sft,
  SftWithToken,
  UpdateNftInput,
  walletAdapterIdentity,
} from "@metaplex-foundation/js";
import { useConnection, useLocalStorage, useWallet } from "@solana/wallet-adapter-react";
import { notify } from "utils/notifications";
import { PublicKey } from "@solana/web3.js";
import { classNames } from "utils";
import { useEffect } from "react";
import AbortController from "abort-controller";
import { useUserNfts } from "hooks";
import { Switch } from "@headlessui/react";

export type FormToken = {
  name: string;
  address: string;
  uri: string;
  model: "nft" | "sft" | "metadata";
};

export const MAX_CREATORS = 5;

export type FormInputs = {
  mint: FormToken;
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
};

const Update: NextPage = () => {
  const { connection } = useConnection();
  const { nfts } = useUserNfts();
  const wallet = useWallet();

  const [isShowingCurrentValues, setIsShowingCurrentValues] = useLocalStorage(
    "showCurrentValues",
    true
  );
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, dirtyFields },
    reset,
    control,
  } = useForm<FormInputs>({
    mode: "onSubmit",
    defaultValues: {
      name: "",
      symbol: "",
      uri: "",
      updateAuthority: "",
      mint: null,
      isMutable: true,
      primarySaleHappened: false,
      creators: [],
      sellerFeeBasisPoints: null,
    },
  });
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "creators",
    rules: {
      maxLength: MAX_CREATORS,
      minLength: 0,
    },
  });

  const isCreatorAddable = fields.length < MAX_CREATORS;
  const watchedMint = watch("mint");
  const PlusButton = (
    <button
      onClick={() => append({ address: "", share: 0 })}
      type="button"
      className="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
    >
      Add Creator
      <PlusCircleIcon className="ml-3 -mr-1 h-5 w-5" aria-hidden="true" />
    </button>
  );

  useEffect(() => {
    const controller = new AbortController();

    async function loadValues() {
      // let token: Sft | SftWithToken | Nft | NftWithToken;
      let token: Metadata<JsonMetadata<string>> | Sft | Nft;

      if (nfts) {
        // Try to find it in user's wallet
        token = nfts.find((metadata) => metadata.address.toBase58() === watchedMint?.address);
      }

      if (!token) {
        // Try to load it
        const metaplex = Metaplex.make(connection);
        if (watchedMint.model === "metadata") {
          const metadata = new PublicKey(watchedMint?.address);
          token = await metaplex
            .nfts()
            .findByMetadata({ metadata, commitment: "confirmed" })
            .run({ signal: controller.signal });
        } else {
          const mintAddress = new PublicKey(watchedMint?.address);
          token = await metaplex
            .nfts()
            .findByMint({ mintAddress, commitment: "confirmed" })
            .run({ signal: controller.signal });
        }
      }
      if (token) {
        setValue("name", token.name);
        setValue("symbol", token.symbol);
        setValue("uri", token.uri);
        setValue("updateAuthority", token.updateAuthorityAddress.toBase58());
        setValue("isMutable", token.isMutable);
        setValue("primarySaleHappened", token.primarySaleHappened);
        setValue("sellerFeeBasisPoints", token.sellerFeeBasisPoints);
        token.creators.forEach((creator, idx) => {
          update(idx, { address: creator.address.toBase58(), share: creator.share });
        });
      }
    }

    if (watchedMint?.address && isShowingCurrentValues) {
      loadValues();
    }

    return () => {
      controller.abort();
    };
  }, [watchedMint, connection, setValue, nfts, update, isShowingCurrentValues, reset]);

  const submit = async (data: FormInputs) => {
    if (!wallet.connected) {
      notify({ type: "error", message: "Connect your wallet" });
      return;
    }

    const metaplex = Metaplex.make(connection).use(walletAdapterIdentity(wallet));

    let token: Sft | SftWithToken | Nft | NftWithToken;
    if (data.mint.model === "metadata") {
      const metadata = new PublicKey(data.mint.address);
      token = await metaplex.nfts().findByMetadata({ metadata, commitment: "confirmed" }).run();
    } else {
      const mintAddress = new PublicKey(data.mint.address);
      token = await metaplex.nfts().findByMint({ mintAddress, commitment: "confirmed" }).run();
    }

    if (!token.updateAuthorityAddress.equals(wallet.publicKey)) {
      notify({
        type: "error",
        message: "Invalid authority",
        description: `This wallet is not the correct update authority. Update authority is: ${token.updateAuthorityAddress.toBase58()}`,
      });
      return;
    }

    const updateNftInput: UpdateNftInput = {
      nftOrSft: token,
      name: dirtyFields.name ? data.name : undefined,
      symbol: dirtyFields.symbol ? data.symbol : undefined,
      uri: dirtyFields.uri ? data.uri : undefined,
      newUpdateAuthority: dirtyFields.updateAuthority
        ? new PublicKey(data.updateAuthority)
        : undefined,
      isMutable: dirtyFields.isMutable ? data.isMutable : undefined,
      primarySaleHappened: dirtyFields.primarySaleHappened ? data.primarySaleHappened : undefined,
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
      const { response } = await metaplex.nfts().update(updateNftInput).run();
      notify({
        type: "success",
        message: "Update succesful",
        description: "View the transaction here",
        txid: response.signature,
      });
    } catch (err) {
      console.log(err);
      notify({
        type: "error",
        message: "Error updating",
        description: "Check the console for more information",
      });
    }
  };

  return (
    <>
      <Head>
        <title>BlastCtrl Tools - Update NFT</title>
        <meta name="Metaplex NFT" content="Basic Functionality" />
      </Head>
      <div className="mx-auto max-w-xl overflow-visible bg-white px-4 pb-5 sm:mb-6 sm:rounded-lg sm:p-6 sm:shadow">
        <div className="border-b border-gray-200 pb-4">
          <h1 className="mb-4 font-display text-3xl font-semibold">Manual NFT update</h1>
          <p className="text-sm text-gray-500">
            Enter the values you wish to update on an NFT, a semi-fungible token, or any other token
            with metadata. Empty fields won&apos;t be updated.
          </p>
        </div>

        <form onSubmit={handleSubmit(submit)} className="space-y-8 divide-y divide-gray-200">
          <div>
            <div className="mt-4">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Select Token</h3>
              <p className="mt-1 text-sm text-gray-500">
                Select an NFT or enter the mint address. You need to be its update authority.
              </p>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-8">
              <div className="sm:col-span-5">
                <NftSelector
                  control={control}
                  name="mint"
                  rules={{
                    required: { value: true, message: "Select a token or enter an address." },
                    validate: {
                      pubkey: (value: FormToken) =>
                        isPublicKey(value?.address) || `Not a valid pubkey: ${value.address}`,
                    },
                  }}
                />
              </div>

              <Switch.Group as="div" className="flex items-center sm:col-span-3">
                <Switch
                  checked={isShowingCurrentValues}
                  onChange={(value) => {
                    setIsShowingCurrentValues(value);
                    if (!value) {
                      reset((formValues) => ({
                        mint: formValues.mint,
                        name: "",
                        symbol: "",
                        isMutable: true,
                        uri: "",
                        primarySaleHappened: false,
                        updateAuthority: "",
                        sellerFeeBasisPoints: null,
                        creators: [],
                      }));
                    }
                  }}
                  className={classNames(
                    isShowingCurrentValues ? "bg-indigo-600" : "bg-gray-200",
                    "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={classNames(
                      isShowingCurrentValues ? "translate-x-5" : "translate-x-0",
                      "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                    )}
                  />
                </Switch>
                <Switch.Label as="span" className="ml-3">
                  <span className="text-sm font-medium text-gray-900">Load current values</span>
                  {/* <span className="text-sm text-gray-500">Load current values</span> */}
                </Switch.Label>
              </Switch.Group>
            </div>
          </div>

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
            </div>
          </div>

          <div>
            <div className="mt-4">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Creators</h3>
              <p className="mt-1 text-sm text-gray-500">There can be up to 5 creators.</p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-6">
                {/* <CreatorsInput control={control} register={register} errors={errors} /> */}
                <div className="flex flex-col gap-y-2">
                  {fields.map((field, idx) => (
                    <fieldset key={field.id}>
                      <legend className="sr-only">Creator address and share</legend>
                      <div className="mt-1 -space-y-px rounded-md bg-white shadow-sm">
                        <div className="grid grid-cols-9 -space-x-px">
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
                  <div className="mt-2">{isCreatorAddable && PlusButton}</div>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label
                  htmlFor="sellerFeeBasisPoints"
                  className="block text-sm font-medium text-gray-700"
                >
                  Royalties{" "}
                  <code className="prose text-sm tracking-tighter">(sellerFeeBasisPoints)</code>
                </label>
                <div className="relative mt-1">
                  <input
                    id="sellerFeeBasisPoints"
                    type="number"
                    {...register("sellerFeeBasisPoints", {
                      min: 0,
                      max: 1000,
                      valueAsNumber: true,
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
              <h3 className="text-lg font-medium leading-6 text-gray-900">Flags and authority</h3>
              <p className="mt-1 text-sm text-gray-500">
                Be careful when changing these. If you remove your own update authority, you will
                not be able to update this NFT anymore.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <InputGroup
                  label="Update authority"
                  register={register("updateAuthority", {
                    validate: {
                      pubkey: (value) => isPublicKey(value) || value === "" || "Not a valid pubkey",
                    },
                  })}
                  error={errors?.updateAuthority}
                />
              </div>

              <div className="sm:col-span-5">
                <SwitchButton
                  label="Is mutable"
                  description="If this flag is changed to false, it wont be possible to change the metadata anymore."
                  props={{ name: "isMutable", control }}
                />
              </div>

              <div className="sm:col-span-5">
                <SwitchButton
                  label="Primary sale happened"
                  description="Indicates that the first sale of this token happened. This flag can be enabled only once and can affect royalty distribution."
                  props={{ name: "primarySaleHappened", control }}
                />
              </div>
            </div>
          </div>

          <div className="pt-5">
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => reset()}
                className="inline-flex items-center rounded-md bg-secondary/20 px-4 py-2 text-base text-secondary shadow-sm hover:bg-secondary/30 focus:outline-none focus:ring-2 focus:ring-secondary-focus focus:ring-offset-2"
              >
                Clear values
              </button>
              <button
                type="submit"
                className="inline-flex items-center rounded-md bg-secondary px-4 py-2 text-base text-gray-50 shadow-sm hover:bg-secondary-focus focus:outline-none focus:ring-2 focus:ring-secondary-focus focus:ring-offset-2"
              >
                Update
                <ChevronDoubleRightIcon className="ml-2 -mr-1 h-5 w-5" aria-hidden={true} />
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Update;
