import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { Metaplex, PublicKey, walletAdapterIdentity } from "@metaplex-foundation/js";
import { WalletAdapterNetwork, WalletError } from "@solana/wallet-adapter-base";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { SpinnerIcon } from "components";
import { InputGroup } from "components/InputGroup";
import { InputMultiline } from "components/InputMultiline";
import { notify } from "components/Notification";
import { UploadFile } from "components/UploadFile";
import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNetworkConfigurationStore } from "stores/useNetworkConfiguration";
import { BundlrStorageDriver } from "utils/bundlr-storage";
import { compress, isPublicKey } from "utils/spl/common";

type TokenData = {
  mint: string;
  name: string;
  symbol: string;
  description?: string;
  external_url?: string;
  image: File;
};

const CreateToken: NextPage = () => {
  const wallet = useWallet();
  const { setVisible } = useWalletModal();
  const { connection } = useConnection();
  const { network } = useNetworkConfigurationStore();
  const [isConfirming, setIsConfirming] = useState(false);
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
    const metaplex = Metaplex.make(connection).use(walletAdapterIdentity(wallet));

    // Upload image
    let imageUri: string;
    let metadataUri: string;

    if (data.image) {
      notify({ title: "Uploading image", description: "Uploading image to arweave..." });
      try {
        imageUri = await storage.upload(data.image);
        notify({ type: "success", title: "Image upload complete" });
      } catch (err: any) {
        setIsConfirming(false);
        return notify({
          type: "error",
          title: "Image Upload Error",
          description: (
            <div className="break-normal">
              <p>
                There has been an error while uploading with the message:{" "}
                <span className="break-all font-medium text-yellow-300">{err?.message}</span>.
              </p>
              <p className="mt-2">
                You can recover any lost funds on the{" "}
                <Link href="/storage/file-upload">
                  <a className="font-medium text-blue-300">/storage</a>
                </Link>{" "}
                page.
              </p>
            </div>
          ),
        });
      }
    }

    notify({ title: "Uploading JSON", description: "Uploading metadata file to arweave..." });
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
    try {
      metadataUri = await storage.upload(metadataFile);
      notify({ type: "success", title: "JSON upload complete" });
    } catch (err) {
      setIsConfirming(false);
      return notify({
        type: "error",
        title: "JSON Upload Error",
        description: (
          <div className="break-normal">
            <p>
              There has been an error while uploading with the message:{" "}
              <span className="break-all font-medium text-yellow-300">{err?.message}</span>.
            </p>
            <p className="mt-2">
              You can recover any lost funds on the{" "}
              <Link href="/storage/file-upload">
                <a className="font-medium text-blue-300">/storage</a>
              </Link>{" "}
              page.
            </p>
          </div>
        ),
      });
    }

    const {
      context: { slot },
    } = await connection.getLatestBlockhashAndContext();
    try {
      const { response } = await metaplex.nfts().createSft(
        {
          name: data.name,
          symbol: data.symbol,
          uri: metadataUri,
          sellerFeeBasisPoints: 0,
          useExistingMint: new PublicKey(data.mint),
        },
        { confirmOptions: { minContextSlot: slot, commitment: "confirmed" } }
      );

      notify({
        title: "Add Metadata Success",
        description: (
          <>
            Metadata created for token{" "}
            <span className="font-medium text-blue-300">{compress(data.mint, 4)}</span>
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
            <div className="mt-4 flex items-center justify-between">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Basic Information</h3>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-y-4 gap-x-4">
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
                    )
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
                description="Token/project homepage (e.g. www.bonkcoin.com), optional"
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
            <div className="mt-4 flex items-center justify-between">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Image</h3>
            </div>

            <UploadFile
              onDrop={(file) => setValue("image", file)}
              onRemove={() => setValue("image", null)}
            />
          </div>

          <div className="pt-5">
            <div className="flex justify-end gap-2">
              <button
                type="submit"
                disabled={isConfirming}
                className="inline-flex items-center rounded-md bg-secondary px-4 py-2 text-base text-gray-50 shadow-sm hover:bg-secondary-focus focus:outline-none focus:ring-2 focus:ring-secondary-focus focus:ring-offset-2"
              >
                {isConfirming ? (
                  <>
                    <SpinnerIcon className="-ml-1 mr-1 h-5 w-5 animate-spin" />
                    Confirming
                  </>
                ) : (
                  <>
                    <ChevronRightIcon className="-ml-1 mr-1 h-5 w-5" aria-hidden={true} />
                    Add metadata
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

export default CreateToken;
