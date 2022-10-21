import { NextPage } from "next";
import Link from "next/link";
import { classNames } from "utils";

const Storage: NextPage = (props) => {
  const navigation = [
    {
      name: "Upload a file (Arweave)",
      href: "/storage/file-upload",
      description: "Upload a file to Arweave via the Bundlr network.",
      active: true,
    },
    {
      name: "Create metadata (Arweave)",
      href: "/storage/create-metadata",
      description:
        "A wizard-like form for creating Metaplex-standard NFT metadata and uploading it to Arweave.",
      active: false,
    },
  ];
  return (
    <>
      <h3 className="pb-4">Access decentralized storage with SOL</h3>
      <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-4">
        {navigation.map((navItem) => (
          <Link key={navItem.name} href={navItem.active ? navItem.href : "#"}>
            <a
              className={classNames(
                "block cursor-pointer rounded-md border border-gray-300 bg-white p-4 transition-all duration-75",
                "hover:bg-indigo-100 hover:ring-2 hover:ring-indigo-600 focus:outline-none",
                !navItem.active && "pointer-events-none"
              )}
            >
              <div className="flex items-center justify-between">
                <span className="block text-base font-medium text-gray-900">{navItem.name}</span>
                {!navItem.active && (
                  <span className="inline-flex rotate-2 items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                    Under construction
                  </span>
                )}
              </div>
              <span
                className={classNames(
                  "mt-1 flex items-center text-sm text-gray-500",
                  !navItem.active && "blur-[2px]"
                )}
              >
                {navItem.description}
              </span>
            </a>
          </Link>
        ))}
      </div>
    </>
  );
};

export default Storage;
