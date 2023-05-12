import { ChevronRightIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { WalletAdapterNetwork, WalletError } from "@solana/wallet-adapter-base";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { InputGroup, InputMultiline, notify, UploadFile, notifyPromise, Select } from "components";
import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNetworkConfigurationStore } from "stores/useNetworkConfiguration";
import { BundlrStorageDriver } from "utils/bundlr-storage";
import { compress, isPublicKey } from "utils/spl/common";
import { createMetadataInstruction, updateMetadataInstruction } from "utils/spl";
import { useWalletConnection } from "hooks/useWalletConnection";
import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import { classNames } from "utils";

type TokenData = {
  mint: string;
  name: string;
  symbol: string;
  description?: string;
  external_url?: string;
  image: File;
};

const actions = ["Add", "Update"] as const;
type Actions = (typeof actions)[number];

const CreateToken: NextPage = () => {
  const wallet = useWallet();
  const { setVisible } = useWalletModal();
  const { connection, simulateVersionedTransaction, sendAndConfirmVersionedTransaction } =
    useWalletConnection();
  const { network } = useNetworkConfigurationStore();
  const [isConfirming, setIsConfirming] = useState(false);
  const [selectedAction, setSelectedAction] = useState<Actions>(actions[0]);
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm<TokenData>({});

  const onSubmit = async (data: TokenData) => {
    if (!wallet.connected) {
      setVisible(true);
      return;
    }

    setIsConfirming(true);
    const storage = new BundlrStorageDriver(connection, wallet, {
      priceMultiplier: 1.5,
      timeout: 60000,
      providerUrl: connection.rpcEndpoint,
      identity: wallet,
      address:
        network === WalletAdapterNetwork.Mainnet
          ? "https://node1.bundlr.network"
          : "https://devnet.bundlr.network",
    });

    // Test if creating metadata is possible
    const ix =
      selectedAction === "Add"
        ? createMetadataInstruction(wallet.publicKey, new PublicKey(data.mint), {})
        : updateMetadataInstruction(wallet.publicKey, new PublicKey(data.mint), {});
    const { value } = await simulateVersionedTransaction([ix]);

    if (value.err) {
      setIsConfirming(false);
      console.log({ value });

      return notify({
        type: "error",
        title: `${selectedAction} Metadata Error`,
        description: (
          <>
            <p className="mb-1.5">
              {selectedAction === "Add" ? "Adding" : "Updating"} metadata to this token is not
              possible due to the error:{" "}
            </p>
            <code className="break-all py-6">{JSON.stringify(value.err)}</code>
          </>
        ),
      });
    }

    // Upload image
    let imageUri: string;
    let metadataUri: string;

    if (data.image) {
      imageUri = await notifyPromise(storage.upload(data.image), {
        loading: { description: "Uploading image to Arweave..." },
        success: { description: "Image upload complete" },
        error: (err: any) => {
          setIsConfirming(false);
          console.log(err);
          return {
            title: "Image Upload Error",
            description: (
              <div className="break-normal">
                <p>
                  There has been an error while uploading with the message:{" "}
                  <span className="break-all font-medium text-yellow-300">{err?.message}</span>.
                </p>
                <p className="mt-2">
                  You can recover any lost funds on the{" "}
                  <Link href="/permanent-storage-tools/file-upload">
                    <a className="font-medium text-blue-300">/permanent-storage-tools</a>
                  </Link>{" "}
                  page.
                </p>
              </div>
            ),
          };
        },
      });
    }

    const json = {
      name: data.name,
      symbol: data.symbol,
      image: imageUri,
      description: data?.description,
      external_url: data.external_url,
    };
    const metadataFile = new File([JSON.stringify(json)], "metadata.json", {
      type: "application/json",
    });

    metadataUri = await notifyPromise(storage.upload(metadataFile), {
      loading: { description: "Uploading metadata file to Arweave..." },
      success: { description: "JSON upload complete" },
      error: (err: any) => {
        setIsConfirming(false);
        console.log({ err });
        return {
          title: "JSON upload error",
          description: (
            <div className="break-normal">
              <p>
                There has been an error while uploading with the message:{" "}
                <span className="break-all font-medium text-yellow-300">{err?.message}</span>.
              </p>
              <p className="mt-2">
                You can recover any lost funds on the{" "}
                <Link href="/permanent-storage-tools/file-upload">
                  <a className="font-medium text-blue-300">/storage</a>
                </Link>{" "}
                page.
              </p>
            </div>
          ),
        };
      },
    });

    try {
      let ix: TransactionInstruction;
      if (selectedAction === "Add") {
        ix = createMetadataInstruction(wallet.publicKey, new PublicKey(data.mint), {
          name: data.name,
          symbol: data.symbol,
          uri: metadataUri,
        });
      } else {
        ix = updateMetadataInstruction(wallet.publicKey, new PublicKey(data.mint), {
          name: data.name,
          symbol: data.symbol,
          uri: metadataUri,
        });
      }
      await notifyPromise(sendAndConfirmVersionedTransaction([ix]), {
        loading: { description: "Confirming transaction" },
        success: (value) => ({
          txid: value.signature,
          title: `${selectedAction} Metadata Success`,
          description: (
            <>
              Metadata {selectedAction === "Add" ? "created" : "updated"} for token{" "}
              <span className="font-medium text-blue-300">{compress(data.mint, 4)}</span>
            </>
          ),
        }),
        error: (err) => ({ title: "Error Creating Metadata", description: err?.message }),
      });
    } catch (err) {
      if (err instanceof WalletError) {
        // The onError callback in the walletconnect context will handle it
        return;
      }
      console.log({ err });
      notify({ type: "error", title: "Error Creating Metadata", description: err?.message });
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <>
      <Head>
        <title>BlastCtrl Tools - Create Token</title>
        <meta name="SPL Token" content="Basic Functionality" />
      </Head>
      <div className="mx-auto max-w-xl overflow-visible bg-white px-4 pb-5 sm:mb-6 sm:rounded-lg sm:p-6 sm:shadow">
        <div className="border-b border-gray-200 pb-4">
          <h1 className="mb-4 font-display text-3xl font-semibold">Add metadata to tokens</h1>
          <p className="text-sm text-gray-500">
            Enter the metadata information of your token. This information will be uploaded to
            Arweave and added to your token. Uploading files will require multiple wallet
            confirmations.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 divide-y divide-gray-200">
          <div>
            <div className="mt-4 ">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Basic Information</h3>
              <p className="text-sm text-gray-500">
                You need to have the mint authority over the token.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-4">
              <div>
                <InputGroup
                  label="Mint address"
                  description={
                    <>
                      Address of your previously created token (
                      <a
                        className="text-blue-500"
                        href="https://spl.solana.com/token#example-creating-your-own-fungible-token"
                      >
                        e.g. with the CLI
                      </a>
                      ).
                    </>
                  }
                  placeholder="Public key"
                  type="text"
                  {...register("mint", {
                    required: true,
                    validate: {
                      isValid: (value) => isPublicKey(value) ?? "Not a valid public key",
                    },
                  })}
                  error={errors?.mint}
                />
              </div>
              <InputGroup
                label="Name"
                description="Full name of your token (e.g. USD Coin)"
                type="text"
                {...register("name", {
                  required: true,
                  maxLength: {
                    value: 32,
                    message: "Max name length is 32",
                  },
                })}
                error={errors?.name}
              />
              <InputGroup
                label="Symbol"
                description="Shorter name (e.g. USDC)"
                type="text"
                {...register("symbol", {
                  required: true,
                  maxLength: {
                    value: 10,
                    message: "Max symbol length is",
                  },
                })}
                error={errors?.symbol}
              />
              <InputGroup
                label="External URL"
                description={
                  <>
                    Token/project homepage, optional{" "}
                    <span className="hidden sm:inline">(e.g. www.bonkcoin.com)</span>
                  </>
                }
                type="text"
                {...register("external_url", {
                  required: false,
                })}
                error={errors?.symbol}
              />
              <InputMultiline
                label="Description"
                description="Optional"
                {...register("description", {
                  required: false,
                })}
                error={errors?.description}
              />
            </div>
          </div>

          <div>
            <div className="mt-4">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Image</h3>
              <ul className="mb-3 mt-1 list-disc text-sm text-gray-500 sm:ml-5">
                <li>Square aspect ratio</li>
                <li>Smaller size (e.g. 200x200 pixels)</li>
                <li>Fit within a circle (most wallets display token icons in a circle)</li>
              </ul>
            </div>

            <UploadFile
              onDrop={(file) => setValue("image", file)}
              onRemove={() => setValue("image", null)}
            />
          </div>

          <div className="pt-5">
            <div className="flex justify-end gap-x-4 gap-y-2">
              <p className="text-sm text-gray-700">
                You will have to approve up to <span className="font-bold text-blue-500">5</span>{" "}
                transactions and messages.
              </p>

              <div className="group inline-flex min-w-fit rounded-md bg-secondary">
                <button
                  type="submit"
                  disabled={isConfirming}
                  className="inline-flex min-w-fit items-center rounded-l-md bg-secondary px-4 py-2 text-base text-gray-50 shadow-sm hover:bg-secondary-focus focus:outline-none focus:ring-2 focus:ring-secondary-focus focus:ring-offset-2 disabled:bg-secondary-focus"
                >
                  {selectedAction} metadata
                </button>

                <Select value={selectedAction} onChange={(v) => setSelectedAction(v)}>
                  <Select.Button className="h-full rounded-r-md px-2 text-gray-50 hover:bg-secondary-focus">
                    <ChevronUpDownIcon className="h-5 w-5" />
                  </Select.Button>
                  <Select.Options className="min-w-[18ch]">
                    {actions.map((value) => (
                      <Select.Option
                        key={value}
                        value={value}
                        className={({ active, selected }) =>
                          classNames(
                            active && "bg-secondary-focus text-white",
                            selected && "bg-secondary text-white",
                            "cursor-pointer rounded-lg px-2 py-1"
                          )
                        }
                      >
                        {value}
                      </Select.Option>
                    ))}
                  </Select.Options>
                </Select>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateToken;
