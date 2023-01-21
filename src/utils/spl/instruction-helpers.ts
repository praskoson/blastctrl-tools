import { PublicKey } from "@solana/web3.js";
import {
  createCreateMetadataAccountV3Instruction,
  DataV2,
} from "@metaplex-foundation/mpl-token-metadata";
import { getMetadata } from "./common";

export const createMetadataInstruction = (
  wallet: PublicKey,
  mint: PublicKey,
  dataV2: Partial<DataV2>
) => {
  const metadata = getMetadata(mint);
  let mintAuthority, updateAuthority, payer;
  mintAuthority = updateAuthority = payer = wallet;
  const dummy: DataV2 = {
    name: "",
    symbol: "",
    uri: "",
    sellerFeeBasisPoints: 0,
    creators: null,
    collection: null,
    uses: null,
  };
  const data = { ...dummy, ...dataV2 };
  return createCreateMetadataAccountV3Instruction(
    {
      mint,
      metadata,
      mintAuthority,
      updateAuthority,
      payer,
    },
    { createMetadataAccountArgsV3: { data, isMutable: true, collectionDetails: null } }
  );
};
