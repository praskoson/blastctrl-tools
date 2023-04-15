import { useRef } from "react";
import { CheemsImage } from "./CheemsImage";
import { ExchangeRate } from "./ExchangeRate";

type Props = {
  quoteToken: string;
};

export const FormLeft = ({ quoteToken }: Props) => {
  const cheemsWrapRef = useRef<HTMLDivElement | null>(null);

  return (
    <div ref={cheemsWrapRef} className="relative hidden flex-1 flex-shrink-0 px-2 sm:block">
      <CheemsImage wrapperRef={cheemsWrapRef} />
      <ExchangeRate baseTokenSymbol="SOL" quoteTokenSymbol={quoteToken} />
    </div>
  );
};
