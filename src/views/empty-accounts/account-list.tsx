import { Account } from "@solana/spl-token-next";
import { useRef, useState } from "react";
import { compress } from "utils/spl";
import { TokenInfo } from "./token-info";

export type AccountListProps = {
  accounts: Account[];
};

export const AccountList = ({ accounts }: AccountListProps) => {
  const checkbox = useRef<HTMLInputElement>();
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [selectedAccounts, setSelectedAccounts] = useState<Account[]>([]);

  const toggleAll = () => {
    setSelectedAccounts(checked || indeterminate ? [] : accounts);
    setChecked(!checked && !indeterminate);
    setIndeterminate(false);
  };

  return (
    <div className="px-2">
      <div className="sm:flex sm:items-center">
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle">
            <div className="relative overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              {selectedAccounts.length > 0 && (
                <div className="absolute top-0 left-12 flex h-12 items-center space-x-3 bg-gray-50 sm:left-16">
                  <button
                    type="button"
                    className="inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    Close selected
                  </button>
                </div>
              )}
              <table className="min-w-full table-fixed divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="xm:px-8 relative w-12 px-6 sm:w-16">
                      <input
                        type="checkbox"
                        className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 sm:left-6"
                        ref={checkbox}
                        checked={checked}
                        onChange={toggleAll}
                      />
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 pr-3 text-left text-sm font-semibold text-gray-900"
                    >
                      Token
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Account
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                    >
                      Balance
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Close</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {accounts.map((account) => (
                    <tr
                      key={account.address.toBase58()}
                      className={selectedAccounts.includes(account) ? "bg-gray-50" : undefined}
                    >
                      <td className="relative w-12 px-6 sm:w-16 sm:px-8">
                        {selectedAccounts.includes(account) && (
                          <div className="absolute inset-y-0 left-0 w-0.5 bg-indigo-600" />
                        )}
                        <input
                          type="checkbox"
                          className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 sm:left-6"
                          value={account.address.toBase58()}
                          checked={selectedAccounts.includes(account)}
                          onChange={(e) =>
                            setSelectedAccounts(
                              e.target.checked
                                ? [...selectedAccounts, account]
                                : selectedAccounts.filter((p) => p !== account)
                            )
                          }
                        />
                      </td>
                      <td className="whitespace-nowrap py-4 pr-3 text-sm font-medium text-gray-900">
                        <TokenInfo mint={account.mint} />
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {compress(account.address.toBase58(), 4)}
                      </td>
                      <td className="text-gry-500 whitespace-nowrap px-3 py-4 font-mono text-sm">
                        {account.amount.toLocaleString()}
                      </td>
                      <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <a href="#" className="text-indigo-600 hover:text-indigo-900">
                          Close
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
