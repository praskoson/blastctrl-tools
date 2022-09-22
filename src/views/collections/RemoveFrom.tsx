import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { TransactionSignature, PublicKey, Transaction } from '@solana/web3.js';
import { FormEvent, useCallback, useState } from 'react';
import { notify } from 'utils/notifications';
import { addNftToCollection, unverifyCollectionNft } from 'utils/spl/collections';

export const RemoveFrom = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [nftStr, setNftStr] = useState('');

  const onClick = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      if (!publicKey) {
        console.log('error', 'Wallet not connected!');
        notify({
          type: 'error',
          message: 'error',
          description: 'Wallet not connected!',
        });
        return;
      }

      let signature: TransactionSignature = '';
      try {
        const nftMint = new PublicKey(nftStr);
        const ix = await unverifyCollectionNft(connection, nftMint, publicKey)
        const tx = new Transaction().add(ix);
        const {
          context: { slot: minContextSlot },
          value: { blockhash, lastValidBlockHeight },
        } = await connection.getLatestBlockhashAndContext();

        signature = await sendTransaction(tx, connection, {
          minContextSlot,
        });

        await connection.confirmTransaction(
          { blockhash, lastValidBlockHeight, signature },
          'confirmed'
        );
        notify({
          type: 'success',
          message: 'Airdrop successful!',
          txid: signature,
        });
      } catch (error: any) {
        notify({
          type: 'error',
          message: `Airdrop failed!`,
          description: error?.message,
          txid: signature,
        });
        console.log('error', `Airdrop failed! ${error?.message}`, signature);
      }
    },
    [publicKey, connection]
  );

  return (
    <form>
      <h3>Remove from collection</h3>
      <div className='form-control'>
        <label className='label'>
          <span className='label-text'>NFT mint</span>
        </label>
        <label className='input-group'>
          <span>NFT</span>
          <input type='text' className='input input-bordered' />
        </label>
      </div>
      <button type='submit' className='btn btn-secondary mt-4'>
        Submit
      </button>
    </form>
  );
};
