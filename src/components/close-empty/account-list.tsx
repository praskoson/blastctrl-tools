/* eslint-disable @next/next/no-img-element */
import { SearchAssetsByOwnerResponse } from "lib/query/types";
import { compress } from "utils/spl";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { cn } from "lib/utils";
import { CopyButton } from "components/copy-button";
const btnClasses = [
  "inline-flex items-center justify-center text-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm text-white",
  "hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2",
  "disabled:bg-indigo-600/50",
];

type Props = {
  tokenAccounts: SearchAssetsByOwnerResponse["items"];
};

type CheckboxState = "indeterminate" | "checked" | "empty";

export const AccountList = ({ tokenAccounts }: Props) => {
  const checkboxRef = useRef<HTMLInputElement>();
  const [checkboxState, setCheckboxState] = useState<CheckboxState>("empty");
  const [selectedAccounts, setSelectedAccounts] = useState<typeof tokenAccounts>([]);

  useLayoutEffect(() => {
    const isIndeterminate =
      selectedAccounts.length > 0 && selectedAccounts.length < tokenAccounts.length;
    const isChecked = selectedAccounts.length === tokenAccounts.length;
    setCheckboxState(isIndeterminate ? "indeterminate" : isChecked ? "checked" : "empty");

    checkboxRef.current.indeterminate = isIndeterminate;
  }, [selectedAccounts, tokenAccounts.length]);

  const toggleAll = () => {
    setSelectedAccounts(checkboxState === "empty" ? tokenAccounts : []);
    setCheckboxState(checkboxState === "empty" ? "checked" : "empty");
  };

  return (
    <div className="size-full">
      <div className="pb-4 flex items-center justify-between gap-2">
        <div className="text-sm">{selectedAccounts.length} accounts selected</div>

        <button className={cn(btnClasses, "ml-auto")}>Reload accounts</button>
        <button disabled={checkboxState === "empty"} className={cn(btnClasses)}>
          Go to checkout
        </button>
      </div>

      <Table dense className="h-[500px] max-h-[500px] scroller overflow-auto rounded">
        <TableHead className="sticky top-0 z-[1]">
          <TableRow className="bg-indigo-600 text-white">
            <TableHeader className="sticky top-0">
              <div className="w-full grid place-content-center">
                <input
                  ref={checkboxRef}
                  checked={checkboxState === "checked"}
                  onChange={toggleAll}
                  type="checkbox"
                  className="accent-blue-600 rounded mx-auto"
                />
              </div>
            </TableHeader>
            <TableHeader className="sticky top-0">Token info</TableHeader>
            <TableHeader className="sticky top-0">Token account</TableHeader>
            <TableHeader className="sticky top-0 hidden sm:table-cell">Token Program</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody className="*:!static">
          {tokenAccounts.map((account) => {
            const isSelected = selectedAccounts.includes(account);
            return (
              <TableRow
                onClick={() => {
                  if (isSelected) {
                    setSelectedAccounts(selectedAccounts.filter((a) => a !== account));
                  } else {
                    setSelectedAccounts([...selectedAccounts, account]);
                  }
                }}
                className={cn(isSelected ? "bg-blue-600/[5%]" : "hover:bg-blue-600/[2.5%]")}
                key={account.id}
              >
                <TableCell>
                  <div className="w-full grid place-content-center">
                    <input
                      type="checkbox"
                      value={account.id}
                      checked={isSelected}
                      onChange={(e) =>
                        setSelectedAccounts(
                          e.target.checked
                            ? [...selectedAccounts, account]
                            : selectedAccounts.filter((a) => a !== account),
                        )
                      }
                      className="rounded accent-blue-600"
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-4">
                    <img
                      src={account?.content?.links?.image}
                      loading="lazy"
                      alt=""
                      height={28}
                      width={28}
                      className="rounded-full size-7"
                    />
                    <div>
                      <div className="font-medium truncate">{account?.content?.metadata.name}</div>
                      <CopyButton
                        clipboard={account.id}
                        className="text-zinc-500 hover:text-zinc-800 focus:text-zinc-800"
                      >
                        {({ copied }) => (copied ? "Copied!" : compress(account.id, 4))}
                      </CopyButton>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div>{account.token_info.balance} tokens</div>
                    <CopyButton
                      clipboard={account.token_info.associated_token_address}
                      className="text-zinc-500 hover:text-zinc-800"
                    >
                      {({ copied }) =>
                        copied
                          ? "Copied!"
                          : compress(account.token_info.associated_token_address, 4)
                      }
                    </CopyButton>
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <CopyButton
                    clipboard={account.token_info.token_program}
                    className="text-zinc-500 hover:text-zinc-800 focus:text-zinc-800"
                  >
                    {({ copied }) =>
                      copied ? "Copied!" : compress(account.token_info.token_program, 4)
                    }
                  </CopyButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
