// Next, React
import { FC, useEffect } from "react";
import Image from "next/image";
import BlastCtrlTag from "../../../public/blastctrl_tag.png";
import Link from "next/link";

// Wallet
import { useWallet, useConnection } from "@solana/wallet-adapter-react";

// Store
import useUserSOLBalanceStore from "../../stores/useUserSOLBalanceStore";
import { WrenchScrewdriverIcon } from "@heroicons/react/24/outline";

export const HomeView: FC = ({}) => {
  const wallet = useWallet();
  const { connection } = useConnection();

  const balance = useUserSOLBalanceStore((s) => s.balance);
  const { getUserSOLBalance } = useUserSOLBalanceStore();

  useEffect(() => {
    if (wallet.publicKey) {
      console.log(wallet.publicKey.toBase58());
      getUserSOLBalance(wallet.publicKey, connection);
    }
  }, [wallet.publicKey, connection, getUserSOLBalance]);

  return (
    // <div className="mx-auto p-4 md:hero">
    //   <div className="flex flex-col md:hero-content">
    //     <h1 className="text-center font-display text-5xl font-bold text-slate-700">
    //       BlastCtrl <span>Tools</span>
    //     </h1>
    //     <h4 className="my-2 text-center text-slate-600 md:w-full">
    //       <p>A small toolbox for the adventuring Solana user.</p>
    //       <p className="px-10 sm:px-0">Mint, build and use these to get out of any trouble.</p>
    //     </h4>
    //     <div className="text-center">
    //       {/* <<RequestAirdrop />> */}
    //       <a href="https://blastctrl.com">
    //         <button className="btn btn-secondary btn-link">Visit our homepage</button>
    //       </a>
    //     </div>
    //   </div>
    // </div>
    <div className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <main className="mx-auto mt-6 max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
          <div className="flex flex-row-reverse sm:gap-x-10 md:gap-x-16">
            <div className="sm:text-center lg:text-left">
              <h1 className="mb-4 font-display text-4xl font-bold tracking-tight text-gray-700 sm:text-5xl">
                BlastCtrl <span className="text-primary">Tools</span>
                <WrenchScrewdriverIcon className="ml-2 inline h-10 w-10 text-gray-600" />
              </h1>
              <div className="mb-8">
                <p className="text-base font-medium text-gray-500 sm:text-xl">
                  A small toolbox for the adventuring Solana degen.
                </p>
                <p className="text-base font-medium text-gray-500 line-clamp-2 sm:text-xl">
                  Use these to build, experiment and if needed, get out of trouble.
                </p>
              </div>
              <div className="flex max-w-md flex-col flex-wrap gap-2 sm:flex-row">
                <Link href="/nft-tools/update">
                  <a className="inline-flex items-center justify-center rounded-lg border-2 border-indigo-600 px-3 py-1.5 text-indigo-900 shadow hover:bg-indigo-50 sm:justify-start">
                    Update NFT Metadata
                  </a>
                </Link>
                <Link href="/nft-tools/collections">
                  <a className="inline-flex items-center justify-center rounded-lg border-2 border-cyan-600 px-3 py-1.5 text-cyan-900 shadow hover:bg-cyan-50">
                    Add/Remove NFT from collection
                  </a>
                </Link>
                <Link href="/storage/file-upload">
                  <a className="inline-flex items-center justify-center rounded-lg border-2 border-orange-600 px-3 py-1.5 text-orange-900 shadow hover:bg-orange-50">
                    Upload files to Arweave
                  </a>
                </Link>
              </div>
              <div className="mt-6 text-sm font-medium text-gray-700">More to come...</div>
            </div>
            <div className="hidden h-auto flex-shrink-0 sm:block sm:w-72 md:w-80 lg:w-96">
              <Image
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
