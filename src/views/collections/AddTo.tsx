import { WalletSignTransactionError } from "@solana/wallet-adapter-base";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { TransactionSignature, PublicKey, Transaction } from "@solana/web3.js";
import { notify } from "components";
import { FormEvent, useCallback, useState } from "react";
import { errorFromCode } from "@metaplex-foundation/mpl-token-metadata";

import { addNftToCollection } from "utils/spl/collections";
import { tryGetErrorCodeFromMessage } from "utils/spl";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

export const AddTo = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const { setVisible } = useWalletModal();
  const [nftStr, setNftStr] = useState("");
  const [collectionStr, setCollectionStr] = useState("");

  const onClick = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      if (!publicKey) {
        setVisible(true);
        return;
      }

      let signature: TransactionSignature = "";
      try {
        const nftMint = new PublicKey(nftStr);
        const collectionMint = new PublicKey(collectionStr);
        const ix = await addNftToCollection(connection, publicKey, nftMint, collectionMint);
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
        console.log(signature);
        notify({ type: "success", title: "Add to collection success", txid: signature });
      } catch (error: any) {
        if (error instanceof WalletSignTransactionError) {
          return;
        }
        console.log({ error });

        const code = tryGetErrorCodeFromMessage(error?.message);
        const decodedError = code ? errorFromCode(code) : undefined;

        notify({
          type: "error",
          title: "Add to collection failed",
          description: (
            <span className="break-words">
              {decodedError ? (
                <>
                  <span className="block">
                    Decoded error:{" "}
                    <span className="font-medium text-orange-300">{decodedError.name}</span>
                  </span>
                  <span className="block">{decodedError.message}</span>
                </>
              ) : error?.message ? (
                <span className="break-words">{error.message}</span>
              ) : (
                "Unknown error, check the console for more details"
              )}
            </span>
          ),
        });
      }
    },
    [publicKey, connection, collectionStr, nftStr, sendTransaction, setVisible]
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
