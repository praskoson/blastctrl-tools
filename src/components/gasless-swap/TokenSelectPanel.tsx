import { LinkIcon, MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { useWallet } from "@solana/wallet-adapter-react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { SpinnerIcon } from "components";
import { PopoverButton } from "components/Popover";
import { useLocalStorageState } from "hooks/useLocalStorage";
import { useJupTokens } from "lib/query/use-jup-tokens";
import { cn } from "lib/utils";
import { useRef, useState } from "react";
import { compress } from "utils/spl";
import { useDebounce } from "utils/use-debounce";

type Token = {
  name: string;
  symbol: string;
  address: string;
  decimals: number;
};

export function TokenSelectPanel({ onSelect }: { onSelect: (token: Token) => void }) {
  const { publicKey } = useWallet();
  const { data, status, error } = useJupTokens(publicKey?.toString());
  const [filter, setFilter] = useState("");
  const debouncedFilter = useDebounce(filter, 400);
  const filteredTokens =
    data?.filter(
      (token) =>
        token.symbol.toLowerCase().includes(debouncedFilter.toLowerCase()) ||
        token.name.toLowerCase().includes(debouncedFilter.toLowerCase()),
    ) || [];

  // The scrollable element for your list
  const parentRef = useRef<HTMLDivElement>(null);

  // The virtualizer
  const rowVirtualizer = useVirtualizer({
    count: filteredTokens.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 48,
  });

  if (status === "error") {
    return (
      <div className="w-[280px] bg-white">
        <p>Error: token list could not be displayed</p>
        <p className="text-gray-700">{error.message}</p>
      </div>
    );
  }

  if (status === "pending") {
    return (
      <div className="grid h-[440px] w-[280px] place-content-center bg-white">
        <SpinnerIcon className="size-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-[440px] w-[280px] flex-col bg-white">
      <div className="relative pb-3">
        <MagnifyingGlassIcon className="absolute left-2 mt-2.5 size-5 text-gray-400" />
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Search for tokens"
          className="w-full border-x-0 border-b-2 border-t-0 border-gray-400 pl-9 placeholder:text-gray-400 focus:border-b-2 focus:border-indigo-600 focus:ring-0"
        />
      </div>

      <div ref={parentRef} className="-mx-4 grow overflow-auto">
        <ul
          style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
          className="relative flex w-full flex-col"
        >
          {rowVirtualizer.getVirtualItems().map((virtualItem) => (
            <li
              key={virtualItem.key}
              className="w-full hover:bg-indigo-100"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <PopoverButton
                onClick={() => onSelect(filteredTokens[virtualItem.index])}
                className="flex h-full w-full items-center gap-3 px-4 py-3"
              >
                {filteredTokens[virtualItem.index]?.logoURI ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    loading="lazy"
                    src={filteredTokens[virtualItem.index]?.logoURI}
                    alt=""
                    height={40}
                    width={40}
                    className="aspect-square h-6 w-6 rounded-full object-cover"
                  />
                ) : (
                  <span className="size-6 rounded-full bg-gray-400" />
                )}
                <span className="font-medium">{filteredTokens[virtualItem.index]?.symbol}</span>
                <a
                  href={`https://solscan.io/token/${filteredTokens[virtualItem.index]?.address}`}
                  target="_blank"
                  onClick={(e) => e.stopPropagation()}
                  className="flex flex-nowrap items-center rounded-md bg-gray-300 px-3 py-1 text-xs"
                >
                  <span className="text-neutral-400 text-xs font-medium">
                    {compress(filteredTokens[virtualItem.index]?.address, 4)}
                  </span>
                  <LinkIcon aria-hidden="true" className="ml-1 size-4" />
                </a>
              </PopoverButton>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
