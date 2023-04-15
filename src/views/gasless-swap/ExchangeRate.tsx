import { ArrowsRightLeftIcon } from "@heroicons/react/24/outline";
import { SpinnerIcon } from "components";
import { QuoteData } from "pages/api/bonk/price";
import { formatNumber, useDataFetch } from "utils";

type Props = {
  baseTokenSymbol: string;
  quoteTokenSymbol: string;
};

const BASE_URL = "/api/bonk/price";

export const ExchangeRate = ({ baseTokenSymbol, quoteTokenSymbol }: Props) => {
  const { data, error } = useDataFetch<QuoteData, Error>(
    `${BASE_URL}?quoteToken=${quoteTokenSymbol}`
  );

  if (error) {
    return <div className="mx-auto p-3">Failed to load token exchange rate</div>;
  }

  if (!error && !data) {
    return (
      <div className="mx-auto flex items-center justify-center">
        <SpinnerIcon className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  const decimalCount = data.rate > 1e6 ? 0 : data.rate > 1e3 ? 2 : 3;

  return (
    <div className="mx-auto flex items-center justify-center gap-x-2 rounded-full border-2 border-amber-600 p-3">
      <span className="text-sm font-medium text-gray-600">1 {baseTokenSymbol}</span>

      <div className="aspect-square w-6 rounded-full bg-gray-200 px-0.5 py-0.5">
        <ArrowsRightLeftIcon className="h-5 w-5 text-gray-900" />
      </div>
      <span className="text-sm font-medium text-gray-600">
        {formatNumber.format(data.rate, decimalCount)} {quoteTokenSymbol}
      </span>
    </div>
  );
};
