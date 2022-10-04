import { NftSelector } from "components/NftSelector";
import { ChevronDoubleRightIcon } from "@heroicons/react/20/solid";
import type { NextPage } from "next";
import Head from "next/head";
import { SwitchButton } from "components/Switch";
import { CreatorsInput } from "components/CreatorsInput";
import { useForm } from "react-hook-form";
import { InputGroup } from "components/InputGroup";
import { isPublicKey } from "utils/spl/common";

export type FormInputs = {
  mint: any;
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
};

const UpdateNft: NextPage = (props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
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
    },
  });
  const submit = (data: FormInputs) => console.log(data);

  return (
    <>
      <Head>
        <title>BlastCtrl Tools - Update NFT</title>
        <meta name="Metaplex NFT" content="Basic Functionality" />
      </Head>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mt-2 max-w-xl overflow-visible bg-white px-4 py-5 shadow sm:mt-6 sm:rounded-lg sm:p-6">
          <div className="border-b border-gray-200 pb-4">
            <h1 className="mb-4 font-display text-3xl font-semibold">Manual NFT update</h1>
            <p className="text-sm text-gray-500">
              Enter the values you wish to update on an NFT, a semi-fungible token, or any other
              token with metadata. Empty fields won{"'"}t be updated.
            </p>
          </div>

          <form onSubmit={handleSubmit(submit)} className="space-y-8 divide-y divide-gray-200">
            <div>
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900">Select Token</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Select an NFT or enter the mint address. You need to be its update authority.
                </p>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <NftSelector
                    control={control}
                    name="mint"
                    rules={{
                      required: { value: true, message: "Select a token or enter an address." },
                    }}
                  />
                </div>
              </div>
            </div>

            <div>
              <div>
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
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900">Creators</h3>
                <p className="mt-1 text-sm text-gray-500">There can be up to 5 creators.</p>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-6">
                  <CreatorsInput control={control} register={register} errors={errors} />
                </div>
              </div>
            </div>

            <div>
              <div>
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
                        pubkey: (value) =>
                          isPublicKey(value) || value === "" || "Not a valid pubkey",
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
                  className="inline-flex items-center rounded-md bg-secondary/20 px-4 py-2 text-base text-secondary shadow-sm hover:bg-secondary/30 focus:outline-none focus:ring-2 focus:ring-secondary-focus focus:ring-offset-2"
                >
                  Cancel
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
      </div>
    </>
  );
};

export default UpdateNft;
