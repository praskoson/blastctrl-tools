import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { TransactionSignature, PublicKey, Transaction } from "@solana/web3.js";
import { FormEvent, useCallback, useState } from "react";

import { unverifyCollectionNft } from "utils/spl/collections";
import { notify, SpinnerIcon } from "components";
import { WalletSignTransactionError } from "@solana/wallet-adapter-base";
import { errorFromCode } from "@metaplex-foundation/mpl-token-metadata";
import { tryGetErrorCodeFromMessage } from "utils/spl";
import {} from "@heroicons/react/20/solid";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

export const RemoveFrom = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const { setVisible } = useWalletModal();
  const [nftStr, setNftStr] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);

  const onClick = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      if (!publicKey) {
        setVisible(true);
        return;
      }

      let signature: TransactionSignature = "";
      try {
        setIsConfirming(true);
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

        notify({
          type: "success",
          title: "Remove from collection succesful",
          txid: signature,
        });
      } catch (error: any) {
        console.log({ error });
        if (error instanceof WalletSignTransactionError) {
          return;
        }
        const code = tryGetErrorCodeFromMessage(error?.message);
        const decodedError = code ? errorFromCode(code) : undefined;

        notify({
          type: "error",
          title: "Remove from collection failed",
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
      } finally {
        setIsConfirming(false);
      }
    },
    [publicKey, connection, nftStr, sendTransaction, setVisible]
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
      <button disabled={isConfirming} type="submit" className="btn btn-secondary mt-4">
        {isConfirming && <SpinnerIcon className="-ml-1 mr-1 h-5 w-5 animate-spin" />}
        {isConfirming ? "Confirming" : "Submit"}
      </button>
    </form>
  );
};
