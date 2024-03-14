import { WrenchScrewdriverIcon } from "@heroicons/react/24/outline";
import Image from "next/legacy/image";
import Link from "next/link";
import BlastCtrlTag from "../../../public/blastctrl_tag.png";

export const HomeView = () => {
  return (
    <div className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <main className="mx-auto mt-6 max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
          <div className="flex flex-row-reverse sm:gap-x-10 md:gap-x-16">
            <div className="sm:text-center lg:text-left">
              <h1 className="mb-4 font-display text-4xl font-bold tracking-tight text-gray-700 sm:text-5xl">
                Blast<span className="text-primary">Tools</span>
                <WrenchScrewdriverIcon className="ml-2 inline h-10 w-10 text-gray-600" />
              </h1>
              <div className="mb-8">
                <p className="text-base font-medium text-gray-500 sm:text-xl">
                  A small toolbox for the adventuring Solana degen.
                </p>
                <p className="line-clamp-2 text-base font-medium text-gray-500 sm:text-xl">
                  Use these to build, experiment and if needed, get out of trouble.
                </p>
              </div>
              <div className="flex max-w-md flex-col flex-wrap gap-2 sm:max-w-lg sm:flex-row">
                <Link
                  href="/solana-nft-tools/update"
                  className="inline-flex items-center justify-center rounded-lg border-2 border-indigo-600 px-3 py-1.5 text-indigo-900 shadow hover:bg-indigo-50 sm:justify-start"
                >
                  Update NFT Metadata
                </Link>
                <Link
                  href="/permanent-storage-tools/file-upload"
                  className="inline-flex items-center justify-center rounded-lg border-2 border-orange-600 px-3 py-1.5 text-orange-900 shadow hover:bg-orange-50"
                >
                  Upload files to Arweave
                </Link>
                <Link
                  href="/solana-nft-tools/collections"
                  className="inline-flex items-center justify-center rounded-lg border-2 border-cyan-600 px-3 py-1.5 text-cyan-900 shadow hover:bg-cyan-50"
                >
                  Add/Remove NFT from collection
                </Link>
                <Link
                  href="/solana-nft-tools/mint"
                  className="inline-flex items-center justify-center rounded-lg border-2 border-sky-600 px-3 py-1.5 text-sky-900 shadow hover:bg-sky-50"
                >
                  Mint NFTs
                </Link>
                <Link
                  href="/spl-token-tools/recover-nested"
                  className="inline-flex items-center justify-center rounded-lg border-2 border-violet-600 px-3 py-1.5 text-violet-900 shadow hover:bg-violet-50"
                >
                  Recover nested accounts
                </Link>
                <Link
                  href="/spl-token-tools/create-token"
                  className="inline-flex items-center justify-center rounded-lg border-2 border-pink-600 px-3 py-1.5 text-pink-900 shadow hover:bg-pink-50"
                >
                  Create fungible tokens
                </Link>
                <Link
                  href="/gasless-swap"
                  className="inline-flex items-center justify-center rounded-lg border-2 border-emerald-600 px-3 py-1.5 text-emerald-900 shadow hover:bg-emerald-50"
                >
                  Gasless Swap
                </Link>
                <Link
                  href="/gasless-bonk-swap"
                  className="inline-flex items-center justify-center rounded-lg border-2 border-orange-600 bg-amber-300 px-3 py-1.5 text-orange-900 shadow hover:bg-amber-200"
                >
                  <Image
                    unoptimized={true}
                    src="/bonk_small.png"
                    height={24}
                    width={24}
                    alt=""
                    className="rounded-full"
                  />
                  <span className="ml-2">Gasless Bonk Swap</span>
                </Link>
              </div>
              <div className="mt-6 text-sm font-medium text-gray-700">More to come...</div>
            </div>
            <div className="hidden h-auto flex-shrink-0 sm:block sm:w-72 md:w-80 lg:w-96">
              <Image
                unoptimized={true}
                src={BlastCtrlTag}
                width={650}
                height={675}
                className="rounded-3xl"
                alt="logo"
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
