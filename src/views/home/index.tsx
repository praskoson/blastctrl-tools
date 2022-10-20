// Next, React
import { FC, useEffect, useState } from "react";
import Link from "next/link";

// Wallet
import { useWallet, useConnection } from "@solana/wallet-adapter-react";

// Components
import { RequestAirdrop } from "../../components/RequestAirdrop";
import pkg from "../../../package.json";

// Store
import useUserSOLBalanceStore from "../../stores/useUserSOLBalanceStore";

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
    <div className="mx-auto p-4 md:hero">
      <div className="flex flex-col md:hero-content">
        <h1 className="text-center font-display text-5xl font-bold text-slate-700">
          BlastCtrl <span>Tools</span>
        </h1>
        <h4 className="my-2 text-center text-slate-600 md:w-full">
          <p>A small toolbox for the adventuring Solana user.</p>
          <p className="px-10 sm:px-0">Mint, build and use these to get out of any trouble.</p>
        </h4>
        <div className="mockup-code mx-auto my-2 max-w-md bg-primary pr-6">
          <pre data-prefix=">">
            <code className="truncate">LFG!!!!!!!!</code>
          </pre>
        </div>
        <div className="text-center">
          {/* <<RequestAirdrop />> */}
          <a href="https://blastctrl.com">
            <button className="btn btn-secondary btn-link">Visit our homepage</button>
          </a>
        </div>
      </div>
    </div>
  );
};
