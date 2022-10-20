import {
  createUpdateMetadataAccountV2Instruction,
  DataV2,
} from "@metaplex-foundation/mpl-token-metadata";
import { PublicKey } from "@solana/web3.js";
import { getMetadata } from "./common";

export const updateNft = (wallet: PublicKey, mint: PublicKey, newUpdateAuthority?: PublicKey) => {
  const metadata = getMetadata(mint);
  const ix = createUpdateMetadataAccountV2Instruction(
    {
      metadata,
      updateAuthority: wallet,
    },
    {
      updateMetadataAccountArgsV2: {
        data: {
          name: "Test",
          symbol: "Test",
          sellerFeeBasisPoints: 100,
          creators: [],
          uri: "test",
          collection: undefined,
          uses: undefined,
        },
        isMutable: true,
        updateAuthority: newUpdateAuthority ?? wallet,
        primarySaleHappened: false,
      },
    }
  );
  return ix;
};
