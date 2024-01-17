import { ChevronRightIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { WalletAdapterNetwork, WalletSignTransactionError } from "@solana/wallet-adapter-base";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { VersionedTransaction } from "@solana/web3.js";
import { notify, notifyPromise } from "components";
import { Popover, PopoverButton, PopoverPanel } from "components/Popover";
import { TokenQuote } from "components/gasless-swap/TokenQuote";
import { TokenSelectPanel } from "components/gasless-swap/TokenSelectPanel";
import { buildWhirlpoolsSwapTransaction, sendWhirlpoolsSwapTransaction } from "lib/octane";
import { useJupQuery } from "lib/query/use-jup-quote";
import { useTokenBalance } from "lib/query/use-token-balance";
import { cn } from "lib/utils";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNetworkConfigurationStore } from "stores/useNetworkConfiguration";
import { formatNumber, numberFormatter } from "utils";
import { lamportsToSol } from "utils/spl/common";
import { useDebounce } from "utils/use-debounce";

type FormData = {
  swapAmount: number;
  slippage: number;
};

type SelectToken = {
  name: string;
  decimals: number;
  symbol: string;
  address: string;
};

const GaslessSwap = () => {
  const { network } = useNetworkConfigurationStore();
  const { publicKey, signTransaction } = useWallet();
  const { setVisible } = useWalletModal();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { slippage: 0.5 },
    mode: "onSubmit",
  });
  const swapAmount = watch("swapAmount");
  const debouncedSwapAmount = useDebounce(swapAmount, 400);
  const [selectToken, setSelectToken] = useState<SelectToken | null>(null);
  const [isSwapping, setIsSwapping] = useState(false);

  const balanceQuery = useTokenBalance(selectToken?.address);
  const quoteQuery = useJupQuery({
    inputMint: selectToken?.address,
    amount: selectToken ? debouncedSwapAmount * Math.pow(10, selectToken?.decimals) : 0,
  });

  const submitSwap = async (data: FormData) => {
    if (!selectToken) return;
    const { swapAmount, slippage } = data;
    const amountAsDecimals = Math.floor(swapAmount * 10 ** selectToken.decimals);

    let signedTransaction: VersionedTransaction;
    let messageToken: string;
    setIsSwapping(true);
    try {
      const swap = await buildWhirlpoolsSwapTransaction(
        publicKey,
        selectToken.address,
        amountAsDecimals,
        slippage,
      );
      messageToken = swap.messageToken;
      signedTransaction = await signTransaction(swap.transaction);
    } catch (err) {
      setIsSwapping(false);
      if (err instanceof WalletSignTransactionError) return;
      return notify({
        type: "error",
        title: "Error Creating Swap Transaction",
        description: err?.message,
      });
    }

    notifyPromise(sendWhirlpoolsSwapTransaction(signedTransaction, messageToken), {
      loading: { description: "Confirming transaction" },
      success: (value) => ({
        title: `${selectToken.name} Swap Success`,
        txid: value,
      }),
      error: (err) => ({ title: "Swap Error", description: err?.message }),
    })
      .catch()
      .finally(() => {
        setIsSwapping(false);
        void balanceQuery.refetch();
      });
  };

  if (network === WalletAdapterNetwork.Devnet) {
    return (
      <div className="mx-auto text-lg">
        This page is only available on mainnet! Switch your network in the wallet menu 👉
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>SPL token tools | Bonk Swap</title>
      </Head>

      <div className="mx-auto max-w-lg overflow-visible bg-white px-4 py-4 sm:mb-6 sm:rounded-lg sm:p-6 sm:shadow">
        <div className="border-b border-gray-200 pb-6">
          <h1 className="mb-4 text-center font-display text-3xl font-semibold">Gasless Swap</h1>
          <p className="text-sm text-gray-500 mx-4">
            Dive deeper into Solana&apos;s DeFi with our Gasless Swap tool! If you have a wallet
            that has no SOL, but owns any token that can be traded on the Jupiter Swap aggregator,
            you can swap it for SOL here! <br />
            <br />
            Just connect your wallet, enter the swap amount and we&apos;ll fund your trade for you.
            <br />
            <br />
            You can swap $BONK with our{" "}
            <Link
              href="/gasless-bonk-swap"
              className="text-blue-600 hover:underline font-medium whitespace-nowrap"
            >
              gasless BONK Swap utility &rarr;
            </Link>
          </p>
        </div>

        <form
          onSubmit={handleSubmit(submitSwap)}
          className="flex flex-1 flex-col justify-start w-[95%] sm:w-4/5 mx-auto"
        >
          <span
            role="button"
            aria-disabled={balanceQuery.status !== "success"}
            onClick={() => {
              if (balanceQuery.data) {
                setValue("swapAmount", balanceQuery?.data?.uiAmount);
              }
            }}
            className="w-full py-2 text-right text-base whitespace-pre"
          >
            <span className="text-xs text-gray-600">Balance </span>
            {balanceQuery.status === "success" ? (
              <span className="font-medium text-amber-600">
                {numberFormatter.format(balanceQuery?.data?.uiAmount)}
              </span>
            ) : (
              <span className="font-medium">0</span>
            )}
          </span>

          <div>
            <div className="flex flex-wrap gap-x-2">
              <label className="text-base font-medium text-gray-600">You will sell:</label>
            </div>
            <div className="relative mt-2 flex w-full justify-between gap-x-2 sm:mt-1">
              <Popover as="div" className="relative">
                <PopoverButton className="h-full w-32 inline-flex items-center border border-transparent justify-between rounded-md bg-gray-200 px-3 font-medium text-gray-800">
                  {selectToken?.symbol || "Name"}
                  <ChevronUpDownIcon className="h-4 w-4 text-gray-700" />
                </PopoverButton>
                <PopoverPanel>
                  <TokenSelectPanel onSelect={(token) => setSelectToken(token)} />
                </PopoverPanel>
              </Popover>

              <input
                type="number"
                step="any"
                inputMode="numeric"
                {...register("swapAmount", {
                  required: true,
                  validate: {
                    notEnoughTokens: (value) =>
                      balanceQuery.data
                        ? value <= balanceQuery?.data?.uiAmount || `Not enough ${selectToken?.name}`
                        : true,
                  },
                })}
                placeholder="0.00"
                className={cn(
                  "block grow min-w-0 rounded-md border-none border-transparent bg-gray-200 text-right font-medium text-gray-600",
                  "rounded-md placeholder:font-medium placeholder:text-gray-400",
                  "focus:outline-none focus:ring-0 sm:text-base",
                )}
              />
            </div>
            <span className="text-sm text-red-600">{errors?.swapAmount?.message}</span>
          </div>

          {/* Price quote */}

          <div className="mt-6">
            <label className="flex w-full flex-wrap items-center justify-between">
              <span className="text-base font-medium text-gray-600">You will receive:</span>
            </label>
            <div className="pointer-events-none relative mt-2 flex h-10 w-full items-center justify-between rounded-md bg-gray-200 px-3 shadow-sm sm:mt-1">
              <div className="inline-flex items-center">
                <Image
                  unoptimized={true}
                  src="/sol_coin.png"
                  alt=""
                  className="rounded-full"
                  height={20}
                  width={20}
                />
                <span className="pl-2 font-medium tracking-wider text-gray-500">SOL</span>
              </div>
              <div className="inline-flex items-center gap-x-2">
                <span className="font-medium text-gray-600">
                  {quoteQuery.data
                    ? formatNumber.format(
                        lamportsToSol(parseFloat(quoteQuery.data?.outAmount || "")),
                        5,
                      )
                    : "0.00"}
                </span>
              </div>
            </div>
          </div>

          <TokenQuote quoteToken={selectToken} />

          <div className="mt-6 flex w-full gap-x-2">
            {publicKey ? (
              <button
                type="submit"
                disabled={isSwapping}
                className="inline-flex flex-auto items-center justify-center rounded-md bg-amber-500 px-2 py-2 font-medium text-white hover:bg-amber-600 disabled:bg-amber-600"
              >
                <ChevronRightIcon className="-ml-1 h-5 w-5 text-white" />
                Submit
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setVisible(true)}
                className="inline-flex flex-auto items-center justify-center rounded-md bg-amber-500 px-2 py-2 font-medium text-white hover:bg-amber-600 disabled:bg-amber-600"
              >
                Connect wallet
              </button>
            )}
          </div>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://station.jup.ag/docs"
            className="mt-1 text-right text-sm text-gray-600 hover:underline"
          >
            Swap is powered by Jupiter
          </a>
        </form>
      </div>
    </>
  );
};

export default GaslessSwap;
