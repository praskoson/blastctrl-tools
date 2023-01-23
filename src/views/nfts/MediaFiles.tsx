import { InformationCircleIcon } from "@heroicons/react/20/solid";
import { Tooltip } from "components";
import Image from "next/image";
import { CreateFormInputs } from "pages/solana-nft-tools/mint";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";
import { abbreviatedNumber, classNames, mimeTypeToCategory } from "utils";

export type MediaFilesProps = {
  setValue: UseFormSetValue<CreateFormInputs>;
  watch: UseFormWatch<CreateFormInputs>;
};

export const MediaFiles = ({ setValue, watch }: MediaFilesProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>();

  const handleDropImage = (files: File[]) => {
    setValue("image", files[0]);
    setImagePreview(URL.createObjectURL(files[0]));
  };
  const handleRemoveImage = () => {
    setValue("image", null);
    URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
  };

  const handleDropAnimationFile = (files: File[]) => setValue("animation_url", files[0]);
  const handleRemoveAnimationFile = () => setValue("animation_url", null);
  const image = watch("image");
  const animationUrl = watch("animation_url");

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxFiles: 1,
    accept: {
      "image/*": [".jpeg", ".png", ".gif", ".jpg"],
    },
    onDropAccepted: handleDropImage,
  });

  const {
    getRootProps: getRootProps2,
    getInputProps: getInputProps2,
    isDragActive: isDragActive2,
  } = useDropzone({
    maxFiles: 1,
    accept: {
      "image/*": [".jpeg", ".png", ".gif", ".jpg", ".webp"],
      "video/*": [".mp4", ".avi", ".mpeg", ".ogv", ".webm", ".3gp"],
      "audio/*": [".mp3", ".aac", ".weba", ".oga", ".wav", ".opus"],
      "text/html": [".html"],
      "model/gltf-binary": [".glb", ".gltf"],
    },
    onDropAccepted: handleDropAnimationFile,
  });

  useEffect(() => {
    return () => URL.revokeObjectURL(imagePreview);
  }, [imagePreview]);

  const mimeCategory = animationUrl
    ? mimeTypeToCategory(animationUrl)
    : image
    ? mimeTypeToCategory(image)
    : "";

  return (
    <div className="mt-6 grid gap-x-6 sm:grid-cols-2">
      <div>
        <p className="py-2 text-left text-sm font-semibold">Image</p>

        <div
          {...getRootProps({
            className: classNames(
              "relative flex justify-center w-full h-64 bg-gray-100 rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6 transition-colors",
              isDragActive && "bg-gray-50"
            ),
          })}
        >
          {imagePreview ? (
            <>
              <Image src={imagePreview} alt="" layout="fill" className="object-contain" />
              <div
                title={image.name}
                className="absolute bottom-3 left-3 z-10 max-w-[120px] overflow-hidden text-ellipsis rounded-full bg-sky-600 py-0.5 px-1.5 text-sm text-white ring-1"
              >
                {image.name}
              </div>
              <button
                onClick={handleRemoveImage}
                className="absolute bottom-3 right-3 z-10 overflow-hidden rounded-full bg-sky-600 py-0.5 px-1.5 text-sm text-white ring-1 hover:bg-sky-700"
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
                <p className="text-gray-500">.jpg, .png, .gif, .webp</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        <p className="py-2 text-left text-sm font-semibold">Additional file (animation)</p>

        <div
          {...getRootProps2({
            className: classNames(
              "relative flex justify-center w-full h-64 rounded-md bg-gray-100 border-2 border-dashed border-gray-300 px-6 pt-5 pb-6 transition-colors",
              isDragActive2 && "bg-gray-50"
            ),
          })}
        >
          {animationUrl ? (
            <>
              <div className="my-auto space-y-4 text-center text-sm text-gray-600">
                <p>{animationUrl.name}</p>
                <p>{abbreviatedNumber(animationUrl.size)}Bytes</p>
                <code>{animationUrl.type}</code>
              </div>
              <button
                type="button"
                onClick={handleRemoveAnimationFile}
                className="absolute bottom-3 right-3 z-10 overflow-hidden rounded-full bg-sky-600 py-0.5 px-1.5 text-sm text-white ring-1 hover:bg-sky-700"
              >
                Remove
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-1 text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1"
                stroke="currentColor"
                className="mx-auto h-10 w-10 text-gray-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                />
              </svg>

              <div className="space-y-2 text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer border-b-2 border-b-secondary text-sm font-medium text-secondary focus-within:outline-none focus-within:ring-2 focus-within:ring-secondary focus-within:ring-offset-2 hover:text-secondary-focus"
                >
                  <span>Select a file</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    className="sr-only"
                    {...getInputProps2()}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
                <p className="text-gray-500">.mp4, .avi, .mp3, .glb, ...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {(image || animationUrl) && (
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
          <dt className="inline-flex max-w-fit items-center gap-x-1 rounded-full bg-blue-100 px-3 py-0.5 text-sm font-medium text-blue-800">
            <span className="mr-1 capitalize">{mimeCategory}</span>
            {" ~ "}
            <span className="font-mono">{animationUrl ? animationUrl.type : image.type}</span>
          </dt>
        </div>
      )}
    </div>
  );
};
