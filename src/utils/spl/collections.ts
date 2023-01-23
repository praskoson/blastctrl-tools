import {
  Metadata,
  createUnverifySizedCollectionItemInstruction,
  createUnverifyCollectionInstruction,
  createSetAndVerifySizedCollectionItemInstruction,
  createSetAndVerifyCollectionInstruction,
} from "@metaplex-foundation/mpl-token-metadata";
import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import { getMasterEdition, getMetadata } from "./common";

export const unverifyCollectionNft = (
  nftMint: PublicKey,
  wallet: PublicKey,
  collectionMint: PublicKey,
  collectionInfo: Metadata
): TransactionInstruction => {
  const metadata = getMetadata(nftMint);
  const collection = getMetadata(collectionMint);
  const collectionMasterEditionAccount = getMasterEdition(collectionMint);

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
