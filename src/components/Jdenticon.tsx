import { useEffect, useRef } from "react";
import { update } from "jdenticon";
import { useWallet } from "@solana/wallet-adapter-react";

export const Jdenticon = ({ size = "100%", value = "test" }) => {
  // const value = publicKey?.toBase58() ?? "test";
  const iconRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    update(iconRef?.current, value);
  }, [value]);

  return <svg data-jdenticon-value={value} height={size} ref={iconRef} width={size} />;
};
