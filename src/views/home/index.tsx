// Next, React
import { FC, useEffect, useState } from 'react';
import Link from 'next/link';

// Wallet
import { useWallet, useConnection } from '@solana/wallet-adapter-react';

// Components
import { RequestAirdrop } from '../../components/RequestAirdrop';
import pkg from '../../../package.json';

// Store
import useUserSOLBalanceStore from '../../stores/useUserSOLBalanceStore';

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
    <div className='md:hero mx-auto p-4'>
      <div className='md:hero-content flex flex-col'>
        <h1 className='text-center text-5xl font-bold font-display text-transparent text-slate-700'>
          BlastCtrl <span>Tools</span>
        </h1>
        <h4 className='md:w-full text-center text-slate-600 my-2'>
          <p>A small toolbox for the adventuring Solana user.</p>
          <p className='px-10 sm:px-0'>Mint, build and use these to get out of any trouble.</p>
        </h4>
        <div className='max-w-md mx-auto mockup-code bg-primary pr-6 my-2'>
          <pre data-prefix='>'>
            <code className='truncate'>LFG!!!!!!!!</code>
          </pre>
        </div>
        <div className='text-center'>
          {/* <<RequestAirdrop />> */}
          <a href='https://blastctrl.com'>
            <button className='btn btn-secondary btn-link'>
              Visit our homepage
            </button>
          </a>
        </div>
      </div>
    </div>
  );
};
