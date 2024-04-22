import { NftAsset } from "lib/query/use-owner-nfts";
import { cn } from "lib/utils";
import Image from "next/legacy/image";

type NftSelectorProp = {
  selected: boolean;
  nft: NftAsset;
};

export const NftSelectorOption = ({ nft, selected }: NftSelectorProp) => {
  return (
    <div className="flex items-center">
      {/* TODO: default image if the json is invalid */}
      {nft.content?.links?.image && (
        <Image
          src={nft.content.links.image}
          alt=""
          height={24}
          width={24}
          objectFit="cover"
          objectPosition="center"
          className="flex-shrink-0 rounded"
        />
      )}

      <span className={cn("ml-3 truncate", selected && "font-semibold")}>
        {nft?.content?.metadata?.name}
      </span>
    </div>
  );
};
