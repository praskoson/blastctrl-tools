import { CreateFormInputs } from "pages/nft-tools/mint";
import { useDropzone } from "react-dropzone";
import { Control, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { classNames, mimeTypeToCategory } from "utils";
import Image from "next/image";
import { useState } from "react";
import { ArrowRightIcon, InformationCircleIcon } from "@heroicons/react/20/solid";
import Tooltip from "components/Tooltip";

export type MediaFilesProps = {
  register: UseFormRegister<CreateFormInputs>;
  control: Control<CreateFormInputs, any>;
  setValue: UseFormSetValue<CreateFormInputs>;
  watch: UseFormWatch<CreateFormInputs>;
};

export const MediaFiles = ({ register, control, setValue, watch }: MediaFilesProps) => {
  // const [image, setImage] = useState<File>();
  const handleDropFile = (files: File[]) => setValue("image", files[0]);
  const handleRemoveImage = () => setValue("image", null);
  const image = watch("image");

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxFiles: 1,
    accept: {
      "image/*": [".jpeg", ".png", ".gif", ".jpg"],
    },
    onDropAccepted: handleDropFile,
  });

  return (
    <div className="mt-6 grid gap-x-6 sm:grid-cols-2">
      <div>
        <p className="py-2 text-center text-sm font-semibold">Image</p>

        <div
          {...getRootProps({
            className: classNames(
              "relative flex justify-center w-full h-64 rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6 transition-colors",
              isDragActive && "bg-accent/30"
            ),
          })}
        >
          {image ? (
            <>
              <Image
                src={URL.createObjectURL(image)}
                alt=""
                layout="fill"
                className="object-contain"
              />
              <div className="absolute bottom-4 left-4 z-10 max-w-[120px] overflow-hidden text-ellipsis rounded-full bg-sky-600 py-0.5 px-1.5 text-sm text-white ring-1 hover:bg-sky-700">
                {image.name}
              </div>
              <button
                onClick={handleRemoveImage}
                className="absolute bottom-4 right-4 z-10 overflow-hidden rounded-full bg-sky-600 py-0.5 px-1.5 text-sm text-white ring-1 hover:bg-sky-700"
              >
                Remove
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-1 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="space-y-2 text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer border-b-2 border-b-secondary text-sm font-medium text-secondary focus-within:outline-none focus-within:ring-2 focus-within:ring-secondary focus-within:ring-offset-2 hover:text-secondary-focus"
                >
                  <span>Select an image</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    className="sr-only"
                    {...getInputProps()}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        <p className="py-2 text-center text-sm font-semibold">Animation</p>
      </div>

      {image && (
        <div className="mt-4 flex flex-col">
          <dd className="inline-flex items-center px-3 py-0.5 text-gray-600">
            Media Category
            <Tooltip
              content={
                <div className="space-y-3">
                  <p>
                    The <em>category</em> of an NFT is based on the MIME type of the files linked
                    within the metadata, with the <code>animation_url</code> file having the highest
                    precedence.
                  </p>
                  <p>
                    The category is an arbitrary value, but it can be used as a way for
                    wallets/dapps to determine how an NFT should be displayed.
                  </p>
                  <p>
                    Supported categories: <code>image, video, audio, vr, html</code>
                  </p>
                  <p>
                    <a
                      className="text-white underline"
                      target="_blank"
                      rel="noopener noreferrer"
                      href="https://docs.metaplex.com/programs/token-metadata/changelog/v1.0"
                    >
                      Metaplex Docs
                    </a>
                  </p>
                </div>
              }
            >
              <InformationCircleIcon className="ml-2 h-4 w-4 text-gray-400 hover:cursor-pointer hover:text-gray-500" />{" "}
            </Tooltip>
          </dd>
          <dt className="inline-flex max-w-fit items-center rounded-full bg-blue-100 px-3 py-0.5 text-sm font-medium text-blue-800">
            <span className="mr-1 capitalize">{mimeTypeToCategory(image.type)}</span>{" "}
            <span className="font-mono">({image.type})</span>
          </dt>
        </div>
      )}
    </div>
  );
};
