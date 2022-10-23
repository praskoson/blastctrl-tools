import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { TransactionSignature, PublicKey, Transaction } from "@solana/web3.js";
import { FormEvent, useCallback, useState } from "react";
import { notify } from "utils/notifications";
import { addNftToCollection } from "utils/spl/collections";

export const AddTo = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [nftStr, setNftStr] = useState("");
  const [collectionStr, setCollectionStr] = useState("");

  const onClick = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      if (!publicKey) {
        console.log("error", "Wallet not connected!");
        notify({
          type: "error",
          message: "error",
          description: "Wallet not connected!",
        });
        return;
      }

      let signature: TransactionSignature = "";
      try {
        const nftMint = new PublicKey(nftStr);
        const collectionMint = new PublicKey(collectionStr);
        const ix = addNftToCollection(publicKey, nftMint, collectionMint);
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
          "confirmed"
        );
        notify({
          type: "success",
          message: "Add to collection success.",
          txid: signature,
        });
      } catch (error: any) {
        notify({
          type: "error",
          message: `Add to collection failed.`,
          description: error?.message,
          txid: signature,
        });
        console.log("error", `Add to collection failed. ${error?.message}`, signature);
      }
    },
    [publicKey, connection, collectionStr, nftStr, sendTransaction]
  );

  return (
    <form onSubmit={onClick}>
      <h3>Add to collection</h3>
      <div className="form-control">
        <label className="label">
          <span className="label-text">NFT mint</span>
        </label>
        <label className="input-group">
          <span>NFT</span>
          <input
            value={nftStr}
            onChange={(e) => setNftStr(e.target.value)}
            type="text"
            className="input-bordered input"
          />
        </label>
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Collection mint</span>
        </label>
        <label className="input-group">
          <span>Collection</span>
          <input
            value={collectionStr}
            onChange={(e) => setCollectionStr(e.target.value)}
            type="text"
            className="input-bordered input"
          />
        </label>
      </div>
      <button type="submit" className="btn btn-secondary mt-4">
        Submit
      </button>
    </form>
  );
};
