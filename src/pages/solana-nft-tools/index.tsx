import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { classNames } from "utils";

const Nfts: NextPage = (props) => {
  const navigation = [
    {
      name: "Update an existing NFT",
      href: "/solana-nft-tools/update",
      description: "Update an NFT by replacing the on-chain fields that you wish to change.",
      active: true,
    },
    {
      name: "Mint a custom NFT",
      href: "/solana-nft-tools/mint",
      description: "Manually enter the on-chain stored information to mint an NFT.",
      active: true,
    },
    {
      name: "Burn NFT",
      href: "/solana-nft-tools",
      description: "Fully burn an NFT, recovering the SOL used to create it.",
      active: false,
    },
    {
      name: "Create a collection",
      href: "/solana-nft-tools/mint",
      query: {
        isCollection: true,
        collectionIsSized: true,
      },
      description:
        "This process is the same as minting an NFT, but the collection flag is set as true.",
      active: true,
    },
    {
      name: "Add or Remove from a collection",
      href: "/solana-nft-tools/collections",
      description: "Add or remove Solana NFTs from an on-chain collection.",
      active: true,
    },
    {
      name: "Solana NFT Faucet",
      href: "/solana-nft-tools/collections",
      description: "Mint a random NFT for testing purposes.",
      active: false,
    },
  ];

  return (
    <>
      <Head>
        <title>Solana NFT Tools | BlastTools - Home</title>
      </Head>
      <h1 className="pb-4">Tools for interacting with Metaplex smart contracts</h1>
      <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-4">
        {navigation.map((navItem) => (
          <Link
            key={navItem.name}
            href={{ pathname: navItem.href, query: navItem.query }}
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

export default Nfts;
