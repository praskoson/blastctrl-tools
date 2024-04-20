import { type ReactNode, type MouseEvent, useState } from "react";

type Props = {
  clipboard: string;
  className?: string;
  children?: ReactNode | ((props: { copied: boolean }) => ReactNode);
};

export const CopyButton = ({ clipboard, className, children }: Props) => {
  const [copied, setCopied] = useState(false);

  const handleClick = async (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!navigator?.clipboard) {
      console.warn("Clipboard not supported");
      return;
    }
    await navigator.clipboard.writeText(clipboard);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  return (
    <button className={className} onClick={handleClick}>
      {typeof children === "function" ? children({ copied }) : children}
    </button>
  );
};
