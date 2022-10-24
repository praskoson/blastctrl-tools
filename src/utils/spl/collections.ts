import {
  Metadata,
  createUnverifySizedCollectionItemInstruction,
  createSetAndVerifySizedCollectionItemInstruction,
  createSetAndVerifyCollectionInstruction,
} from "@metaplex-foundation/mpl-token-metadata";
import { Connection, PublicKey, TransactionInstruction } from "@solana/web3.js";
import { getMasterEdition, getMetadata } from "./common";

export const unverifyCollectionNft = async (
  connection: Connection,
  nftMint: PublicKey,
  wallet: PublicKey
): Promise<TransactionInstruction> => {
  try {
    const metadata = getMetadata(nftMint);
    const metadataInfo = await Metadata.fromAccountAddress(connection, metadata);
    if (!metadataInfo.collection?.key) {
      throw Error("NFT does not have a verified collection");
    }
    const collectionMint = metadataInfo.collection?.key;
    const collection = getMetadata(collectionMint);
    const collectionMasterEditionAccount = getMasterEdition(collectionMint);

    return createUnverifySizedCollectionItemInstruction({
      payer: wallet,
      metadata,
      collectionMint,
      collection,
      collectionMasterEditionAccount,
      collectionAuthority: wallet,
    });
  } catch (err) {
    throw Error("Error creating unverifySizedCollectionInstruction");
  }
};

export const addNftToCollection = async (
  connection: Connection,
  wallet: PublicKey,
  nftMint: PublicKey,
  collectionMint: PublicKey
): Promise<TransactionInstruction> => {
  try {
    const metadata = getMetadata(nftMint);
    const collection = getMetadata(collectionMint);
    const collectionMasterEditionAccount = getMasterEdition(collectionMint);
    const collectionMetadata = await Metadata.fromAccountAddress(connection, collection);

    if (collectionMetadata.collectionDetails && collectionMetadata.collectionDetails.size) {
      // This is a sized collection
      return createSetAndVerifySizedCollectionItemInstruction({
        payer: wallet,
        updateAuthority: wallet,
        collectionMint,
        collection,
        collectionMasterEditionAccount,
        collectionAuthority: wallet,
        metadata,
      });
    } else {
      // This is an unsized collection
      return createSetAndVerifyCollectionInstruction({
        payer: wallet,
        updateAuthority: wallet,
        collectionMint,
        collection,
        collectionMasterEditionAccount,
        collectionAuthority: wallet,
        metadata,
      });
    }
  } catch (err) {
    throw Error("Error creating setAndVerifySizedCollectionItemInstruction", err);
  }
};
