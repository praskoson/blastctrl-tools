import { useJupPrice } from "lib/query/use-jup-price";
import { SpinnerIcon } from "components";
import { ArrowsRightLeftIcon } from "@heroicons/react/24/outline";
import { formatNumber } from "utils/common";

type Props = {
  quoteToken: {
    name: string;
    address: string;
  } | null;
};

export const TokenQuote = ({ quoteToken }: Props) => {
  const { data, error, isLoading } = useJupPrice("SOL", quoteToken?.address || "");

  const decimalCount = data?.SOL?.price > 1e6 ? 0 : data?.SOL?.price > 1e3 ? 2 : 3;

  if (!quoteToken) {
    return <div aria-hidden="true" className="h-12"></div>;
  }

  return (
    <div className="h-12 flex items-center justify-center">
      {error && <p>Failed to load token exchange rate</p>}

      {isLoading && (
        <div className="w-full">
          <SpinnerIcon className="mx-auto h-5 w-5 animate-spin" />
        </div>
      )}

      {data && (
        <div className="text-sm font-medium text-gray-600 flex items-center gap-x-2 justify-center flex-nowrap">
          <span>1 SOL</span>

          <div className="aspect-square w-6 rounded-full bg-gray-200 px-0.5 py-0.5">
            <ArrowsRightLeftIcon className="h-5 w-5 text-gray-900" />
          </div>

          <span>
            {formatNumber.format(data.SOL?.price, decimalCount)} {quoteToken.name}
          </span>
        </div>
      )}
    </div>
  );
};
