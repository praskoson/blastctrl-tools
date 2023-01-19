import { ReactNode, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { classNames } from "utils";

export type UploadFileProps = {
  label?: ReactNode;
  onDrop?: (file: File) => void;
  onRemove?: (file: File) => void;
};

export const UploadFile = ({ label, onDrop, onRemove }: UploadFileProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>();

  const handleDropImage = (files: File[]) => {
    setFile(files[0]);
    setImagePreview(URL.createObjectURL(files[0]));
    onDrop?.(files[0]);
  };

  const handleRemoveImage = () => {
    URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    onRemove?.(file);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxFiles: 1,
    accept: {
      "image/*": [".jpeg", ".png", ".gif", ".jpg"],
    },
    onDropAccepted: handleDropImage,
  });

  useEffect(() => {
    return () => URL.revokeObjectURL(imagePreview);
  }, [imagePreview]);

  return (
    <div>
      {label && <p className="py-2 text-left text-sm font-semibold">{label}</p>}

      <div
        {...getRootProps({
          className: classNames(
            "relative flex justify-center w-full h-24 md:h-48 bg-gray-100 rounded-md border-2 border-gray-300 px-6 pt-5 pb-6 transition-colors",
            isDragActive && "bg-gray-50"
          ),
        })}
      >
        {imagePreview ? (
          <div className="bg-red h-full w-full">
            <Image src={imagePreview} alt="" layout="fill" className="object-contain" />
            <div
              title={file.name}
              className="absolute bottom-3 left-3 z-10 max-w-[120px] overflow-hidden text-ellipsis rounded-full bg-sky-600 py-0.5 px-1.5 text-sm text-white ring-1"
            >
              {file.name}
            </div>
            <button
              onClick={handleRemoveImage}
              className="absolute bottom-3 right-3 z-10 overflow-hidden rounded-full bg-sky-600 py-0.5 px-1.5 text-sm text-white ring-1 hover:bg-sky-700"
            >
              Remove
            </button>
          </div>
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
              <p className="text-blue-500">.jpg, .png, .gif, .webp</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
