import { Account } from "@solana/spl-token-next";
import { classNames } from "utils";
import { compress } from "utils/spl";
import { findTokenByMint } from "utils/spl/common-tokens";
import { findNestedAta } from "utils/spl/nested-ata";
import Image from "next/image";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/solid";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { normalizeTokenAmount } from "utils/spl/common";

type NestedListProps = {
  nestedTokenAccounts?: Awaited<ReturnType<typeof findNestedAta>>;
};

export const NestedList = ({ nestedTokenAccounts }: NestedListProps) => {
  if (!nestedTokenAccounts || nestedTokenAccounts?.length === 0) {
    return <div className="pt-4 pb-1 font-normal">No nested accounts found ✔</div>;
  }

  const singleOrMany = nestedTokenAccounts.length === 1;

  return (
    <div className="mt-4 border-t border-gray-200 pt-4 pb-1">
      <h3 className="text-center font-medium text-indigo-600">
        {nestedTokenAccounts.length} nested token account{singleOrMany ? "" : "s"} found.
      </h3>

      <ul role="list" className="mt-4 w-full space-y-4">
        {nestedTokenAccounts.map(({ parent, nested }, idx) => (
          <li key={idx}>
            <NestedInfo key={idx} parent={parent} nested={nested} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export const NestedInfo = ({ parent, nested }: { parent: Account; nested: Account }) => {
  const parentTokenInfo = findTokenByMint(parent.mint.toBase58());
  const nestedTokenInfo = findTokenByMint(nested.mint.toBase58());

  const handleRecover = (parent: Account, nested: Account) => async () => {};

  return (
    <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow ring-1 ring-black/5">
      <div className="px-4 py-5 sm:p-6">
        <div className="grid gap-y-4 xs:grid-cols-2">
          {[parent, nested].map((account, idx) => {
            const tokenInfo = idx === 0 ? parentTokenInfo : nestedTokenInfo;

            return (
              <div key={idx} className="flex">
                <div className="mr-4 mt-2 flex-shrink-0 self-start">
                  {tokenInfo ? (
                    <Image
                      src={tokenInfo.image}
                      className="rounded-full"
                      alt="Token logo"
                      height={40}
                      width={40}
                    />
                  ) : (
                    <QuestionMarkCircleIcon className="h-10 w-10 rounded-full text-blue-400" />
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-gray-700">
                    {idx === 0 ? "Parent" : "Nested"}
                  </h4>
                  {tokenInfo ? (
                    <p className="text-sm text-gray-700">{tokenInfo.ticker}</p>
                  ) : (
                    <p className="font-mono tracking-tighter text-gray-700">
                      {compress(account.mint.toBase58(), 6)}
                    </p>
                  )}
                  <p className="tracking-tigher font-mono text-xs font-medium text-gray-500">
                    {compress(account.address.toBase58(), 6)}
                  </p>
                  <p className="mt-2 text-right font-mono text-gray-900">
                    {normalizeTokenAmount(
                      account.amount.toString(),
                      tokenInfo?.decimals ?? 0
                    ).toLocaleString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex justify-end bg-gray-50 px-4 py-2 sm:px-6">
        <button className="inline-flex items-center rounded-full border border-transparent bg-green-600 px-3 py-0.5 text-white hover:bg-green-700">
          Recover
          <ChevronRightIcon className="ml-1 -mr-2 h-5 w-5" />
        </button>
      </div>
    </div>
  );
};
