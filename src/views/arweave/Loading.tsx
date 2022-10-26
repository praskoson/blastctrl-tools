import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { classNames } from "utils";

export const LoadingUploadView = () => {
  return (
    <div className="mx-auto px-4 md:hero">
      <div className="flex flex-col md:hero-content">
        <div className="mb-4 sm:mb-0 sm:border-b sm:border-gray-200 sm:pb-3">
          <h1 className="mb-2 text-center font-display text-3xl font-semibold text-gray-900">
            Simple Arweave Uploader
          </h1>
          <p className="text-center text-sm leading-snug tracking-tight text-gray-900">
            Upload files to Arweave using the Bundlr Network and paying in SOL.
          </p>
        </div>

        {/* Drop upload */}
        <div>
          <div>
            <div className="sm:grid sm:grid-cols-2 sm:items-start sm:gap-4">
              <div className="mt-1 sm:col-span-2 sm:mt-0">
                <div
                  className={classNames(
                    "flex h-[140px] w-[236px] animate-pulse bg-gray-100 max-w-lg justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6 transition-colors"
                  )}
                >
                  <div className="flex items-center justify-center">
                    <ArrowPathIcon className="h-16 w-16 text-gray-300 animate-spin animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
