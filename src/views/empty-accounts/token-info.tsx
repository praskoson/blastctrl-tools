import { GlobeAltIcon } from "@heroicons/react/20/solid";
import { PublicKey } from "@solana/web3.js";
import { CopyButton } from "components";
import { useNftJson } from "hooks";
import { useTokenInfo } from "hooks/useTokenInfo";
import { useMemo } from "react";
import { compress } from "utils/spl";
import Image from "next/image";
import useQueryContext from "hooks/useQueryContext";

export const TokenInfo = ({ mint }: { mint: PublicKey }) => {
  const { fmtUrlWithCluster } = useQueryContext();
  const { mintInfo } = useTokenInfo(mint);
  const { json, isError } = useNftJson(mintInfo?.data.uri);
  const mint58 = useMemo(() => mint.toBase58(), [mint]);
  const explorerLink = fmtUrlWithCluster(`https://solscan.io/account/${mint58}`);

  const name = useMemo(() => {
    if (json?.name) return json.name;
    if (mintInfo?.data?.name) return mintInfo.data.name;
    return compress(mint58, 4);
  }, [json, mintInfo, mint58]);

  const image = json?.image ? (
    <Image width={20} height={20} className="rounded-full" src={json.image} alt="" />
  ) : (
    <span className="h-5 w-5 rounded-full bg-indigo-400"></span>
  );

  return (
    <span className="inline-flex items-center gap-x-0.5">
      {image}

      <CopyButton className="inline-flex items-center" content={name} text={compress(mint58, 4)} />

      <a href={explorerLink} target="_blank" rel="noreferrer">
        <GlobeAltIcon className="h-5 w-5 text-gray-600" />
      </a>
    </span>
  );
};
