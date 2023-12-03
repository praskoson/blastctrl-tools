import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { classNames } from "utils";

const Storage: NextPage = () => {
  const navigation = [
    {
      name: "Upload a file to Arweave",
      href: "/permanent-storage-tools/file-upload",
      description: "The file will be uploaded via the Irys network.",
      active: true,
    },
    {
      name: "Create NFT metadata on Arweave",
      href: "/permanent-storage-tools/create-metadata",
      description:
        "A wizard-like form for creating Metaplex-standard NFT metadata and uploading it to Arweave.",
      active: false,
    },
  ];
  return (
    <>
      <Head>
        <title>Permanent NFT Storage | BlastTools</title>
      </Head>
      <h1 className="pb-4">
        Use SOL to pay for permanent decentralised NFT metadata and media storage.
      </h1>
      <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-4">
        {navigation.map((navItem) => (
          <Link
            key={navItem.name}
            href={navItem.active ? navItem.href : "#"}
            className={classNames(
              "block cursor-pointer rounded-md border border-gray-300 bg-white p-4 transition-all duration-75",
              "hover:bg-indigo-100 hover:ring-2 hover:ring-indigo-600 focus:outline-none",
              !navItem.active && "pointer-events-none"
            )}
          >
            <div className="flex items-center justify-between">
              <h2 className="block text-base font-medium text-gray-900">{navItem.name}</h2>
              {!navItem.active && (
                <span className="inline-flex rotate-2 items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                  Under construction
                </span>
              )}
            </div>
            <h3
              className={classNames(
                "mt-1 flex items-center text-sm text-gray-500",
                !navItem.active && "blur-[2px]"
              )}
            >
              {navItem.description}
            </h3>
          </Link>
        ))}
      </div>
    </>
  );
};

export default Storage;
