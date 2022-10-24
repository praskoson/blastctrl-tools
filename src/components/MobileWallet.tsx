import { Disclosure, RadioGroup } from "@headlessui/react";
import { ClipboardDocumentIcon, ClipboardIcon } from "@heroicons/react/20/solid";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  useWalletModal,
  WalletConnectButton,
  WalletModalButton,
} from "@solana/wallet-adapter-react-ui";
import Image from "next/image";
import { useCallback, useMemo, useState } from "react";
import { useNetworkConfigurationStore } from "stores/useNetworkConfiguration";
import { classNames } from "utils";
import { compress } from "utils/spl";
import { Jdenticon } from "./Jdenticon";

export const MobileWallet = () => {
  const { network, setNetwork } = useNetworkConfigurationStore();
  const { publicKey, wallet, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const [copied, setCopied] = useState(false);
  const wallet58 = useMemo(() => publicKey?.toBase58(), [publicKey]);

  const openModal = useCallback(() => {
    setVisible(true);
  }, [setVisible]);

  const writeToClipboard = async () => {
    if (!navigator?.clipboard) {
      console.warn("Clipboard not supported");
      return;
    }
    await navigator.clipboard.writeText(wallet58);
    setCopied(true);
    setTimeout(() => setCopied(false), 400);
  };

  if (!wallet) {
    return (
      <div className="border-t border-white px-4 pt-4 pb-3">
        <WalletModalButton />
      </div>
    );
  }
  if (!publicKey) {
    return (
      <div className="border-t border-white px-4 pt-4 pb-3">
        <WalletConnectButton />
      </div>
    );
  }

  return (
    <div className="border-t border-white pt-4 pb-3">
      <div className="flex items-center justify-between gap-x-3 px-4">
        <div className="inline-flex items-center gap-x-3">
          <div className="flex-shrink-0 overflow-hidden rounded-full border-2 border-white bg-gray-800">
            <Jdenticon size="42px" value={wallet58} />
          </div>
          <div className="cursor-default truncate text-base font-medium tracking-wider text-white">
            {compress(wallet58, 4)}
          </div>
          <button type="button" className="flex items-center" onClick={writeToClipboard}>
            {copied ? (
              <span className="text-sm text-white">Copied!</span>
            ) : (
              <ClipboardDocumentIcon className="mr-2 h-5 w-5 text-white hover:text-red-200" />
            )}
          </button>
        </div>
        <div className="flex-shrink-0 rounded-lg px-3 py-1 hover:bg-primary-focus">
          <Image src={wallet.adapter.icon} height={36} width={36} alt="wallet icon" />
        </div>
      </div>
      <div className="mt-3 px-2">
        <div>
          <RadioGroup
            className="my-2 flex items-center gap-x-4 px-3 text-white"
            value={network}
            onChange={setNetwork}
          >
            <RadioGroup.Option value="mainnet-beta">
              {({ checked }) => (
                <button
                  className={classNames(
                    "rounded-md border border-gray-300 px-3 py-2 font-sans tracking-wide text-gray-100 shadow transition-colors hover:cursor-pointer",
                    "focus:outline-none focus:ring-2",
                    checked
                      ? "border-secondary bg-secondary text-secondary-content hover:bg-secondary-focus focus:ring-secondary"
                      : "border-gray-300 hover:bg-primary-focus focus:ring-gray-300"
                  )}
                >
                  Mainnet
                </button>
              )}
            </RadioGroup.Option>
            <RadioGroup.Option value="testnet">
              {({ checked }) => (
                <button
                  type="button"
                  className={classNames(
                    "rounded-md border border-gray-300 px-3 py-2 font-sans tracking-wide text-gray-100 shadow transition-colors hover:cursor-pointer",
                    "focus:outline-none focus:ring-2",
                    checked
                      ? "border-secondary bg-secondary text-secondary-content hover:bg-secondary-focus focus:ring-secondary"
                      : "border-gray-300 hover:bg-primary-focus focus:ring-gray-300"
                  )}
                >
                  Testnet
                </button>
              )}
            </RadioGroup.Option>
            <RadioGroup.Option value="devnet">
              {({ checked }) => (
                <button
                  type="button"
                  className={classNames(
                    "rounded-md border border-gray-300 px-3 py-2 font-sans tracking-wide text-gray-100 shadow transition-colors hover:cursor-pointer",
                    "focus:outline-none focus:ring-2",
                    checked
                      ? "border-secondary bg-secondary text-secondary-content hover:bg-secondary-focus focus:ring-secondary"
                      : "border-gray-300 hover:bg-primary-focus focus:ring-gray-300"
                  )}
                >
                  Devnet
                </button>
              )}
            </RadioGroup.Option>
          </RadioGroup>
        </div>
        <button
          type="button"
          onClick={openModal}
          className="block w-full rounded-md py-2 px-3 text-left text-base font-medium text-gray-50 hover:bg-primary-focus hover:text-white"
        >
          Change wallet
        </button>
        <button
          onClick={() => disconnect()}
          className=" block w-full rounded-md py-2 px-3 text-left text-base font-medium text-gray-50 hover:bg-primary-focus hover:text-white"
        >
          Sign out
        </button>
      </div>
    </div>
  );
};
