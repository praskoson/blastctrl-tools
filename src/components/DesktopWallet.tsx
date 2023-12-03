import { Menu, RadioGroup, Transition } from "@headlessui/react";
import { ClipboardDocumentIcon } from "@heroicons/react/20/solid";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  useWalletModal,
  WalletConnectButton,
  WalletModalButton,
} from "@solana/wallet-adapter-react-ui";
import Image from "next/legacy/image";
import { Fragment, useCallback, useMemo, useState } from "react";
import { useNetworkConfigurationStore } from "stores/useNetworkConfiguration";
import { classNames } from "utils";
import { compress } from "utils/spl";
import SolanaLogo from "../../public/solanaLogoMark.svg";

export const DesktopWallet = () => {
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
      <WalletModalButton
        startIcon={<Image unoptimized={true} src={SolanaLogo} height={20} width={20} alt="" />}
        style={{ height: 36, lineHeight: 36 }}
      >
        Select Wallet
      </WalletModalButton>
    );
  }
  if (!publicKey) {
    return <WalletConnectButton className="rounded-md border border-white py-1" />;
  }
  return (
    <Menu as="div" className="relative ml-4 flex-shrink-0">
      <Menu.Button className="rounded-md bg-primary-focus flex gap-2 items-center py-1.5 px-4">
        <span className="sr-only">Open user menu</span>
        <Image src={wallet.adapter.icon} height={24} width={24} alt="wallet icon" />
        <span className="font-semibold text-sm text-white">{compress(wallet58, 4)}</span>
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-fit origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="border-b border-gray-300 px-3 py-2 text-sm text-gray-600">
            <div className="text-sm text-gray-600">Connected as</div>
            <div className="flex items-center">
              <div className="mt-1 mr-2 text-lg font-bold text-gray-700">
                {compress(wallet58, 4)}
              </div>
              <button type="button" className="flex items-center" onClick={writeToClipboard}>
                {copied ? (
                  <span className="text-sm text-gray-600">Copied!</span>
                ) : (
                  <ClipboardDocumentIcon className="mr-2 h-5 w-5 text-gray-500 hover:text-gray-600" />
                )}
              </button>
            </div>
          </div>
          <div>
            <RadioGroup
              className="my-2 flex items-center gap-x-2 px-3 text-white"
              value={network}
              onChange={setNetwork}
            >
              <RadioGroup.Option value="mainnet-beta">
                {({ checked }) => (
                  <button
                    className={classNames(
                      "rounded-md border border-gray-300 px-1.5 py-0.5 text-sm tracking-tight",
                      "focus:outline-none focus:ring-2",
                      checked
                        ? "border-secondary bg-secondary text-secondary-content hover:bg-secondary-focus focus:ring-secondary"
                        : "border-gray-300 text-gray-600 hover:bg-gray-50 focus:ring-gray-300"
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
                      "rounded-md border border-gray-300 px-1.5 py-0.5 text-sm tracking-tight",
                      "focus:outline-none focus:ring-2",
                      checked
                        ? "border-secondary bg-secondary text-secondary-content hover:bg-secondary-focus focus:ring-secondary"
                        : "border-gray-300 text-gray-600 hover:bg-gray-50 focus:ring-gray-300"
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
                      "rounded-md border border-gray-300 px-1.5 py-0.5 text-sm tracking-tight",
                      "focus:outline-none focus:ring-2",
                      checked
                        ? "border-secondary bg-secondary text-secondary-content hover:bg-secondary-focus focus:ring-secondary"
                        : "border-gray-300 text-gray-600 hover:bg-gray-50 focus:ring-gray-300"
                    )}
                  >
                    Devnet
                  </button>
                )}
              </RadioGroup.Option>
            </RadioGroup>
          </div>
          <Menu.Item>
            {({ active }) => (
              <button
                type="button"
                onClick={openModal}
                className={classNames(
                  active ? "bg-gray-100" : "",
                  "block w-full px-4 py-2 text-left text-sm text-gray-700"
                )}
              >
                Change wallet
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                type="button"
                onClick={() => disconnect()}
                className={classNames(
                  active ? "bg-gray-100" : "",
                  "block w-full px-4 py-2 text-left text-sm text-gray-700"
                )}
              >
                Sign out
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};
