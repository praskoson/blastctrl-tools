import { LinkIcon } from "@heroicons/react/20/solid";
import { ReactNode, useState } from "react";

type CopyButtonProps = {
  // children: ReactNode;
  text: string;
  content: string;
  className?: string;
};

export const CopyButton = ({ text, content, className }: CopyButtonProps) => {
  const [copied, setCopied] = useState(false);
  const handleClick = async () => {
    if (!navigator?.clipboard) {
      console.warn("Clipboard not supported");
      return;
    }
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  const copyMessage = copied ? <span className="text-blue-500">Copied!</span> : text;

  return (
    <button onClick={handleClick}>
      <span className={className}>
        <LinkIcon className={`mx-0.5 h-4 w-4 ${copied ? "text-blue-400" : ""}`} />
        {copyMessage}
      </span>
    </button>
  );
};
