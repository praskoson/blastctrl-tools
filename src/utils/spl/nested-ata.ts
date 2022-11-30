import { Account, TOKEN_PROGRAM_ID, unpackAccount } from "@solana/spl-token-next";
import { AccountInfo, Connection, PublicKey } from "@solana/web3.js";
import { sleep } from "utils";

export const findNestedAta = async ({
  connection,
  walletAccounts,
  onProgress,
}: {
  connection: Connection;
  walletAccounts: Account[];
  onProgress?: (index: number) => void;
}) => {
  const result: {
    parent: Account;
    nested: Account;
  }[] = [];

  for (let i = 0; i < walletAccounts.length; i++) {
    const account = walletAccounts[i];

    const maybeNested = await connection.getTokenAccountsByOwner(account.address, {
      programId: TOKEN_PROGRAM_ID,
    });

    if (maybeNested.value.length > 0) {
      maybeNested.value.forEach((nested) => {
        const nestedAcc = unpackAccount(nested.pubkey, nested.account);
        result.push({ parent: account, nested: nestedAcc });
      });
    }
    onProgress(i);

    await sleep(800);
  }
  return result;
};
