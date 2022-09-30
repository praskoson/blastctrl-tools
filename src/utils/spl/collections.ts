import {
  Metadata,
  createUnverifyCollectionInstruction,
  createSetAndVerifySizedCollectionItemInstruction,
} from '@metaplex-foundation/mpl-token-metadata';
import { Connection, PublicKey, TransactionInstruction } from '@solana/web3.js';
import { getMasterEdition, getMetadata } from './common';

export const unverifyCollectionNft = async (
  connection: Connection,
  nftMint: PublicKey,
  wallet: PublicKey
): Promise<TransactionInstruction> => {
  try {
    const metadata = getMetadata(nftMint);
    const metadataInfo = await Metadata.fromAccountAddress(
      connection,
      metadata
    );
    if (!metadataInfo.collection?.key) {
      throw Error('NFT does not have a verified collection');
    }
    const collectionMint = metadataInfo.collection?.key;
    const collection = getMetadata(collectionMint);
    const collectionMasterEditionAccount = getMasterEdition(collectionMint);

    return createUnverifyCollectionInstruction({
      metadata,
      collectionMint,
      collection,
      collectionMasterEditionAccount,
      collectionAuthority: wallet,
    });
  } catch (err) {
    throw Error('Error creating unverifyCollectionInstruction');
  }
};

export const addNftToCollection = (
  wallet: PublicKey,
  nftMint: PublicKey,
  collectionMint: PublicKey
): TransactionInstruction => {
  try {
    const metadata = getMetadata(nftMint);
    const collection = getMetadata(collectionMint);
    const collectionMasterEditionAccount = getMasterEdition(collectionMint);

    return createSetAndVerifySizedCollectionItemInstruction({
      payer: wallet,
      updateAuthority: wallet,
      collectionMint,
      collection,
      collectionMasterEditionAccount,
      collectionAuthority: wallet,
      metadata,
    });
  } catch (err) {
    throw Error('Error creating unverifyCollectionInstruction');
  }
};
