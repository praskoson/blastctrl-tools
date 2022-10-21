import { ReactNode } from "react";

type CopyButtonProps = {
  children: ReactNode;
  content: string;
};

export const CopyButton = ({ children, content }: CopyButtonProps) => {
  const handleClick = async () => {
    if (!navigator?.clipboard) {
      console.warn("Clipboard not supported");
      return;
    }
    await navigator.clipboard.writeText(content);
    // setCopied(true);
    // setTimeout(() => {
    //   setCopied(false);
    // }, 1000);
  };

  return <button onClick={handleClick}>{children}</button>;
};
