import { ArrowsRightLeftIcon } from "@heroicons/react/24/outline";
import { formatNumber } from "utils";

type Props = {
  baseTokenSymbol: string;
  quoteTokenSymbol: string;
  swapTokens: () => void;
  quote: { rate: number };
};

export const ExchangeRate = ({ baseTokenSymbol, quoteTokenSymbol, swapTokens, quote }: Props) => {
  return (
    <div className="mx-auto flex items-center justify-center gap-x-2 rounded-lg border border-amber-600 p-3">
      <span className="text-sm font-medium text-gray-600">1 {baseTokenSymbol}</span>
      <button
        type="button"
        onClick={swapTokens}
        className="rounded-full bg-amber-500 p-1 hover:bg-amber-600"
      >
        <ArrowsRightLeftIcon className="h-5 w-5 text-white" />
      </button>
      <span className="text-sm font-medium text-gray-600">
        {formatNumber.format(quote.rate, 5)} {quoteTokenSymbol}
      </span>
    </div>
  );
};
