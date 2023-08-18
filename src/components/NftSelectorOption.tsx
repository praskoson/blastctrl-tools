import { useNftJson } from "hooks";
import Image from "next/legacy/image";
import { FormToken } from "pages/solana-nft-tools/update";

type NftSelectorProp = {
  metadata: FormToken;
  selected: boolean;
};

const classNames = (...classNames: any[]) => classNames.filter(Boolean).join(" ");

export const NftSelectorOption = ({ metadata, selected }: NftSelectorProp) => {
  const { json, isLoading, isError } = useNftJson(metadata.uri);

  return (
    <div className="flex items-center">
      {isError && <div className="h-6 w-6 flex-shrink-0 rounded bg-slate-200"></div>}

      {isLoading && (
        <div className="h-6 w-6 flex-shrink-0 animate-pulse rounded bg-slate-400"></div>
      )}

      {/* TODO: default image if the json is invalid */}
      {json?.image && (
        <Image
          src={json?.image}
          alt=""
          height={24}
          width={24}
          objectFit="cover"
          objectPosition="center"
          className="flex-shrink-0 rounded"
        />
      )}

      <span className={classNames("ml-3 truncate", selected && "font-semibold")}>
        {metadata.name}
      </span>
    </div>
  );
};
