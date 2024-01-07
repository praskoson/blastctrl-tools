import { getAssociatedTokenAddressSync } from "@solana/spl-token-next";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";

export function useTokenBalance(tokenMint: string | PublicKey) {
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  return useQuery({
    enabled: !!publicKey && !!tokenMint,
    queryKey: ["token-balance", publicKey?.toString(), tokenMint?.toString()],
    queryFn: async () => {
      let mint = typeof tokenMint === "string" ? new PublicKey(tokenMint) : tokenMint;
      const ata = getAssociatedTokenAddressSync(mint, publicKey, true);

      try {
        const result = await connection.getTokenAccountBalance(ata, "confirmed");
        return { uiAmount: result.value.uiAmount, amount: result.value.amount };
      } catch (_e) {
        return { uiAmount: 0, amount: "0" };
      }
    },
  });
}
