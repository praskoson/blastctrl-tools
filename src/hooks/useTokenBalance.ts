import { getAssociatedTokenAddressSync, AccountLayout, ACCOUNT_SIZE } from "@solana/spl-token-next";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useEffect, useState } from "react";
import { normalizeTokenAmount } from "utils/spl/common";

export const useTokenBalance = (tokenMint: string | PublicKey, decimals: number) => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [tokenBalance, setTokenBalance] = useState<number | null>(null);

  useEffect(() => {
    if (!publicKey) return;
    let isCancelled = false;
    let listener: number;

    const bonkAta = getAssociatedTokenAddressSync(new PublicKey(tokenMint), publicKey, true);
    connection.getTokenAccountBalance(bonkAta, "confirmed").then((result) => {
      if (!isCancelled) {
        setTokenBalance(result.value.uiAmount);
      }
    });

    listener = connection.onAccountChange(bonkAta, (accountInfo) => {
      const rawAccount = AccountLayout.decode(accountInfo.data.slice(0, ACCOUNT_SIZE));
      const uiAmount = normalizeTokenAmount(rawAccount.amount.toString(), decimals);
      setTokenBalance(uiAmount);
    });

    return () => {
      isCancelled = true;
      void connection.removeAccountChangeListener(listener);
    };
  }, [connection, decimals, publicKey, tokenMint]);

  return { tokenBalance };
};
