import { useMemo, useState } from "react";
import { useUserNfts } from "hooks";
import { Combobox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { NftSelectorOption } from "./NftSelectorOption";
import { UseControllerProps, useController } from "react-hook-form";
import type { FormInputs, FormToken } from "pages/update-nft";
import { classNames } from "utils";

export const NftSelector = (props: UseControllerProps<FormInputs>) => {
  const [query, setQuery] = useState("");
  const { isError, isLoading, nfts } = useUserNfts();

  const {
    field: { name, onBlur, onChange, ref, value },
    fieldState: { error },
  } = useController(props);

  const tokens = useMemo(
    () =>
      isLoading || isError
        ? []
        : nfts.map((nft) => ({
            name: nft.name,
            address: nft.address.toBase58(),
            uri: nft.uri,
            model: nft.model,
          })),
    [isError, isLoading, nfts]
  );

  const filteredTokens =
    isLoading || isError
      ? []
      : query === ""
      ? tokens
      : tokens.filter((nft) => {
          return nft.name.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <>
      <Combobox as="div" value={value} onChange={onChange} nullable>
        <Combobox.Label className="sr-only">Mint address</Combobox.Label>

        <div className="relative mt-1">
          <Combobox.Input
            ref={ref}
            type="text"
            data-lpignore="true"
            placeholder="Token"
            autoComplete="false"
            className={classNames(
              "w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm",
              "focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm",
              error &&
                "border-red-300 text-red-900  focus:border-red-500 focus:outline-none focus:ring-red-500"
            )}
            name={name}
            onBlur={onBlur}
            onChange={(event) => setQuery(event.target.value)}
            displayValue={(nft: FormToken) => nft?.name || ""}
            aria-invalid={error ? "true" : "false"}
          />

          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </Combobox.Button>

          <Combobox.Options
            className={classNames(
              "absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg",
              "ring-1 ring-black ring-opacity-5",
              "focus:outline-none sm:text-sm"
            )}
          >
            {query.length > 0 && (
              <Combobox.Option
                value={{ name: query, address: query, uri: "", model: 'nft' }}
                className={({ active }) =>
                  classNames(
                    "relative cursor-default select-none py-2 pl-3 pr-9",
                    active ? "bg-indigo-600 text-white" : "text-gray-900"
                  )
                }
              >
                {query}
              </Combobox.Option>
            )}
            {filteredTokens.map((nft) => (
              <Combobox.Option
                key={nft.address}
                value={nft}
                className={({ active }) =>
                  classNames(
                    "relative cursor-default select-none py-2 pl-3 pr-9",
                    active ? "bg-indigo-600 text-white" : "text-gray-900"
                  )
                }
              >
                {({ active, selected }) => (
                  <>
                    <NftSelectorOption metadata={nft} selected={selected} />
                    {selected && (
                      <span
                        className={classNames(
                          "absolute inset-y-0 right-0 flex items-center pr-4",
                          active ? "text-white" : "text-indigo-600"
                        )}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        </div>
      </Combobox>

      {error && (
        <p className="mt-2 text-sm text-red-600" id={error.type}>
          {error.message}
        </p>
      )}
    </>
  );
};
