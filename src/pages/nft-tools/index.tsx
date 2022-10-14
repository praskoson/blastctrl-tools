import { NextPage } from "next";
import Link from "next/link";
import { classNames } from "utils";

const Nfts: NextPage = (props) => {
  const navigation = [
    {
      name: "Update an NFT",
      href: "/nft-tools/update",
      description: "Update an NFT by replacing the on-chain fields that you wish to change.",
      active: true,
    },
    {
      name: "Mint an NFT",
      href: "/nft-tools",
      description: "Manually enter the on-chain stored information to mint an NFT.",
      active: false,
    },
    {
      name: "Burn NFT",
      href: "/nft-tools",
      description: "Fully burn an NFT, recovering the SOL used to create it.",
      active: false,
    },
    {
      name: "Create a collection",
      href: "/nft-tools",
      description:
        "Create a collection mint. This process is the same as creating a regular NFT, but you need to set the collection field.",
      active: false,
    },
    {
      name: "Add or remove from a collection",
      href: "/nft-tools/collections",
      description: "Add or remove NFTs from an on-chain collection.",
      active: true,
    },
    {
      name: "Faucet",
      href: "/nft-tools/collections",
      description: "Mint random NFTs for testing or other purposes.",
      active: false,
    },
  ];
  return (
    <>
      <h3 className="pb-4">Tools for interacting with Metaplex smart contracts</h3>
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

export default Nfts;
