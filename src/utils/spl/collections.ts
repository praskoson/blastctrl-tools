import {
  Metadata,
  createUnverifySizedCollectionItemInstruction,
  createUnverifyCollectionInstruction,
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
    const collectionInfo = await Metadata.fromAccountAddress(connection, collection);

    if (collectionInfo?.collectionDetails && collectionInfo?.collectionDetails?.size) {
      // This is a sized collection
      return createUnverifySizedCollectionItemInstruction({
        payer: wallet,
        metadata,
        collectionMint,
        collection,
        collectionMasterEditionAccount,
        collectionAuthority: wallet,
      });
    } else {
      // This is an unsized collection
      return createUnverifyCollectionInstruction({
        metadata,
        collectionMint,
        collection,
        collectionMasterEditionAccount,
        collectionAuthority: wallet,
      });
    }
  } catch (err) {
    throw Error("Error creating unverifySizedCollectionInstruction", { cause: err });
  }
};

export const addNftToCollection = (
  wallet: PublicKey,
  nftMint: PublicKey,
  collectionMint: PublicKey,
  collectionMetadata: Metadata
): TransactionInstruction => {
  const metadata = getMetadata(nftMint);
  const collection = getMetadata(collectionMint);
  const collectionMasterEditionAccount = getMasterEdition(collectionMint);

  if (collectionMetadata.collectionDetails) {
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
};
