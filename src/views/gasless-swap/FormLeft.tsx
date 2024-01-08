import { useRef } from "react";
import { CheemsImage } from "./CheemsImage";
import { useJupPrice } from "lib/query/use-jup-price";
import { SpinnerIcon } from "components";
import { ArrowsRightLeftIcon } from "@heroicons/react/24/outline";
import { formatNumber } from "utils/common";

type Props = {
  quoteToken: {
    name: string;
    mint: string;
  };
};

export const FormLeft = ({ quoteToken }: Props) => {
  const cheemsWrapRef = useRef<HTMLDivElement | null>(null);
  const { data, error, isLoading } = useJupPrice("SOL", quoteToken.mint);

  const decimalCount = data?.SOL?.price > 1e6 ? 0 : data?.SOL?.price > 1e3 ? 2 : 3;

  return (
    <div ref={cheemsWrapRef} className="relative hidden flex-1 flex-shrink-0 px-2 sm:block">
      <CheemsImage wrapperRef={cheemsWrapRef} />
      {error && <div className="mx-auto p-3">Failed to load token exchange rate</div>}
      {isLoading && (
        <div className="mx-auto flex items-center justify-center">
          <SpinnerIcon className="h-5 w-5 animate-spin" />
        </div>
      )}

      {data && (
        <div className="mx-auto flex items-center justify-center gap-x-2 rounded-full border-2 border-amber-600 p-3">
          <span className="text-sm font-medium text-gray-600">1 SOL</span>

          <div className="aspect-square w-6 rounded-full bg-gray-200 px-0.5 py-0.5">
            <ArrowsRightLeftIcon className="h-5 w-5 text-gray-900" />
          </div>
          <span className="text-sm font-medium text-gray-600">
            {formatNumber.format(data.SOL?.price, decimalCount)} {quoteToken.name}
          </span>
        </div>
      )}
    </div>
  );
};
