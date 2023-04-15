import { useRef } from "react";
import { CheemsImage } from "./CheemsImage";
import { ExchangeRate } from "./ExchangeRate";

export const FormLeft = () => {
  const cheemsWrapRef = useRef<HTMLDivElement | null>(null);

  return (
    <div ref={cheemsWrapRef} className="relative hidden flex-1 flex-shrink-0 px-2 sm:block">
      <CheemsImage wrapperRef={cheemsWrapRef} />
      <ExchangeRate
        baseTokenSymbol="SOL"
        quoteTokenSymbol="BONK"
        swapTokens={() => {}}
        quote={{ rate: 0.1 }}
      />
    </div>
  );
};
