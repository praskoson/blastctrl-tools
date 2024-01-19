import { Cluster, clusterApiUrl, Connection, PublicKey, Transaction } from "@solana/web3.js";
import { NextApiRequest, NextApiResponse } from "next";
import { Networks } from "utils/endpoints";
import { unverifyCollectionNft } from "utils/spl/collections";
import { Metadata } from "@metaplex-foundation/mpl-token-metadata";
import { getMetadata } from "utils/spl";
import { chunk } from "lib/utils";

export type TxUnverifyData = {
  tx: string[];
  blockhash: string;
  lastValidBlockHeight: number;
  minContextSlot: number;
};

export type Input = {
  authorityAddress: string;
  nftMints: string[];
  network: Cluster;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<TxUnverifyData>) {
  if (req.method === "POST") {
    const { authorityAddress, nftMints, network } = req.body as Input;

    const connection = new Connection(Networks[network]);
    const authority = new PublicKey(authorityAddress);
    const nfts = nftMints.map((str) => new PublicKey(str));
    const nftMetadata = await Metadata.fromAccountAddress(connection, getMetadata(nfts[0]));
    const collection = nftMetadata.collection.key;
    const collectionMetadata = await Metadata.fromAccountAddress(
      connection,
      getMetadata(collection),
    );

    const batchSize = 12;
    const chunkedInstructions = chunk(
      nfts.map((nft) => unverifyCollectionNft(nft, authority, collection, collectionMetadata)),
      batchSize,
    );

    const {
      context: { slot: minContextSlot },
      value: { blockhash, lastValidBlockHeight },
    } = await connection.getLatestBlockhashAndContext("finalized");
    const transactions = chunkedInstructions.map((batch) =>
      new Transaction({ feePayer: authority, blockhash, lastValidBlockHeight }).add(
        ...batch.flat(),
      ),
    );

    // for (const tx of transactions) {
    //   const result = await connection.simulateTransaction(tx, []);
    // }

    const serializedTransactionsBase64 = transactions.map((tx) =>
      tx
        .serialize({
          requireAllSignatures: false,
          verifySignatures: true,
        })
        .toString("base64"),
    );

    res
      .status(200)
      .json({ tx: serializedTransactionsBase64, blockhash, lastValidBlockHeight, minContextSlot });
  } else {
    res
      .status(405)
      .json({ tx: [], blockhash: null, lastValidBlockHeight: null, minContextSlot: null });
  }
}
