import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { TransactionSignature, PublicKey, Transaction } from "@solana/web3.js";
import { FormEvent, useCallback, useState } from "react";
import { notify } from "utils/notifications";
import { unverifyCollectionNft } from "utils/spl/collections";
import toast from "react-hot-toast";

export const RemoveFrom = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [nftStr, setNftStr] = useState("");

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
        const ix = await unverifyCollectionNft(connection, nftMint, publicKey);
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
        // notify({
        //   type: "success",
        //   message: "Remove from collection successful!",
        //   txid: signature,
        // });
        toast.success("Remove from collection success");
      } catch (error: any) {
        toast.error("Remove from collection failed!");
        // notify({
        //   type: "error",
        //   message: `Remove from collection failed!`,
        //   description: error?.message,
        //   txid: signature,
        // });
        console.log("error", `Remove from collection failed! ${error?.message}`, signature);
      }
    },
    [publicKey, connection, nftStr, sendTransaction]
  );

  return (
    <form onSubmit={onClick}>
      <h3>Remove from collection</h3>
      <div className="form-control">
        <label className="label">
          <span className="label-text">NFT mint</span>
        </label>
        <label className="input-group">
          <span>NFT</span>
          <input
            onChange={(e) => setNftStr(e.target.value)}
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
