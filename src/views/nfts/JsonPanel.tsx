import { Dialog, Transition } from "@headlessui/react";
import { XCircleIcon } from "@heroicons/react/24/solid";
import type { UploadMetadataInput } from "@metaplex-foundation/js";
import { toMetaplexFileFromBrowser } from "@metaplex-foundation/js";
import { InputGroup } from "components/InputGroup";
import Image from "next/image";
import { Fragment } from "react";
import { useForm } from "react-hook-form";
import { BiImageAdd } from "react-icons/bi";

type JsonPanelProps = {
  open: boolean;
  setOpen: (state: boolean) => void;
  setJson: (file: UploadMetadataInput) => void;
};

type CreateJsonInputs = {
  name: string;
  symbol: string;
  description: string;
  externalUrl: string;
  image: FileList;
};

export const JsonPanel = ({ open, setOpen, setJson }: JsonPanelProps) => {
  const {
    register,
    formState: { errors },
    watch,
    handleSubmit,
    setValue,
  } = useForm<CreateJsonInputs>({});
  const image = watch("image");

  const onSubmit = async (data: CreateJsonInputs) => {
    const json: UploadMetadataInput = {
      name: data.name,
      symbol: data.symbol,
      description: data.description,
      external_url: data.externalUrl,
      image: await toMetaplexFileFromBrowser(image.item(0), { contentType: image.item(0).type }),
    };

    setJson(json);
    setOpen(false);
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>
        {/* <div className="fixed inset-0" /> */}

        <form onSubmit={handleSubmit(onSubmit)} className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-500"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-500"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl">
                    <div className="flex min-h-0 flex-1 flex-col overflow-y-scroll pb-6">
                      <div className="bg-secondary py-6 px-4 sm:px-6">
                        <Dialog.Title className="text-lg font-medium text-secondary-content">
                          Create an external metadata file
                        </Dialog.Title>
                        <div className="mt-1">
                          <p className="text-sm text-[#91b9e3]">
                            Enter the values and files that will be associated with your NFT.
                          </p>
                        </div>
                      </div>
                      <div className="relative flex flex-1 flex-col">
                        <div className="divide-y divide-gray-200 px-4 pt-4 sm:px-6">
                          <div className="space-y-4 pb-6">
                            {/* Text inputs */}

                            <InputGroup
                              label="Name"
                              register={register("name", {
                                required: true,
                              })}
                              error={errors?.name}
                            />

                            <InputGroup
                              label="Symbol"
                              register={register("symbol")}
                              error={errors?.symbol}
                            />

                            <InputGroup
                              label="Description"
                              register={register("description")}
                              error={errors?.description}
                            />

                            <InputGroup
                              label="External URL"
                              register={register("externalUrl")}
                              error={errors?.externalUrl}
                            />
                          </div>

                          {/* Images and files section */}
                          <div className="pt-6">
                            {/* <label
                              className="text-sm font-medium text-gray-700"
                            >
                              Image
                            </label> */}
                            <div className="group relative mt-2 h-48 w-64 overflow-hidden rounded-xl border-2 border-dashed border-gray-300 drop-shadow-md hover:cursor-pointer">
                              {image?.length > 0 ? (
                                <>
                                  <Image
                                    src={URL.createObjectURL(image.item(0))}
                                    alt=""
                                    height={192}
                                    width={256}
                                    className="object-cover"
                                  />
                                  <div className="absolute right-0 bottom-0 z-10 m-2 hidden group-hover:block">
                                    <button
                                      className="h-min w-min overflow-hidden rounded-full"
                                      onClick={() => setValue("image", null)}
                                    >
                                      <XCircleIcon className="h-8 w-8 bg-white text-red-500 hover:text-red-700" />
                                    </button>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <label
                                    htmlFor="image_upload"
                                    className="flex h-full w-full flex-col items-center justify-center text-center text-gray-600 hover:cursor-pointer group-hover:text-gray-400"
                                  >
                                    <BiImageAdd className="h-10 w-10" />
                                    Upload an image
                                  </label>
                                  <input
                                    id="image_upload"
                                    className="sr-only"
                                    type="file"
                                    accept=".gif,.jpg,.jpeg,.png"
                                    {...register("image")}
                                  />
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-shrink-0 justify-end px-4 py-4">
                      <button
                        type="button"
                        className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        onClick={() => setOpen(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="ml-4 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        Create
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </form>
      </Dialog>
    </Transition.Root>
  );
};
