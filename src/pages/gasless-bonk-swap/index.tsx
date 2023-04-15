import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { CogIcon } from "@heroicons/react/24/outline";
import { WalletAdapterNetwork, WalletSignTransactionError } from "@solana/wallet-adapter-base";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { PublicKey, Transaction } from "@solana/web3.js";
import { notify, notifyPromise, SpinnerIcon } from "components";
import SelectMenu from "components/SelectMenu";
import { useTokenBalance } from "hooks";
import { debounce } from "lodash-es";
import { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { WhirlpoolQuoteData } from "pages/api/bonk/whirlpool-quote";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNetworkConfigurationStore } from "stores/useNetworkConfiguration";
import useOctaneConfigStore from "stores/useOctaneConfigStore";
import { classNames, fetcher, formatNumber, numberFormatter } from "utils";
import { buildWhirlpoolsSwapTransaction, sendWhirlpoolsSwapTransaction } from "utils/octane";
import { FormLeft } from "views/gasless-swap/FormLeft";

type FormData = {
  swapAmount: number;
  slippage: number;
};

const BONK_MINT_58 = "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263";
const BONK_MINT = new PublicKey(BONK_MINT_58);
const BONK_DECIMALS = 5;
const slippages = [
  { value: 0.1, label: "0.1%", id: 0 },
  { value: 0.5, label: "0.5%", id: 1 },
  { value: 1, label: "1%", id: 2 },
];

const BonkSwap: NextPage = () => {
  const { network } = useNetworkConfigurationStore();
  const { publicKey, signTransaction } = useWallet();
  const { setVisible } = useWalletModal();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { slippage: 0.5 },
    mode: "onSubmit",
  });
  const [notifyId, setNotifyId] = useState<string>("");
  const [isSwapping, setIsSwapping] = useState(false);
  const [priceQuote, setPriceQuote] = useState<WhirlpoolQuoteData | null>(null);
  const [isFetchingQuote, setIsFetchingQuote] = useState(false);

  useOctaneConfigStore((s) => s.config);
  const { fetchOctaneConfig, getSwapFeeConfig } = useOctaneConfigStore();
  const { tokenBalance } = useTokenBalance(BONK_MINT, BONK_DECIMALS);
  useEffect(fetchOctaneConfig, [fetchOctaneConfig]);

  const getQuote = async (num: number) => {
    if (!num) return setPriceQuote(null);

    setIsFetchingQuote(true);
    try {
      const quote = await fetcher<WhirlpoolQuoteData>("/api/bonk/whirlpool-quote", {
        method: "POST",
        body: JSON.stringify({
          amountIn: num * 0.95,
          numerator: 10,
          denominator: 1000,
        }),
        headers: { "Content-type": "application/json; charset=UTF-8" },
      });
      setPriceQuote(quote);
    } catch (err) {
      setPriceQuote(null);
    } finally {
      setIsFetchingQuote(false);
    }
  };

  const debouncedGetQuote = useMemo(() => debounce(getQuote, 500), []);

  const submitSwap = async (data: FormData) => {
    // Bonk!
    const { swapAmount, slippage } = data;

    const feeConfig = getSwapFeeConfig(BONK_MINT_58);
    const mintAsPublicKey = BONK_MINT;
    const amountAsDecimals = Math.floor(swapAmount * 10 ** feeConfig.decimals);

    let signedTransaction: Transaction;
    let messageToken: string;
    setIsSwapping(true);
    try {
      const swap = await buildWhirlpoolsSwapTransaction(
        publicKey,
        mintAsPublicKey,
        amountAsDecimals,
        slippage
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

    await notifyPromise(sendWhirlpoolsSwapTransaction(signedTransaction, messageToken), {
      loading: { description: "Confirming transaction" },
      success: (value) => ({
        title: "Bonk Swap Success",
        txid: value,
      }),
      error: (err) => ({ title: "Bonk Swap Error", description: err?.message }),
    });

    setIsSwapping(false);
  };

  const handleSolClick = (amount: number) => async () => {
    const id = notify(
      {
        type: "info",
        title: `${amount} SOL is enough for...`,
        description: (
          <ul className="mt-1 ">
            <li>
              <span className="font-bold text-blue-400">~{Math.round(amount / 0.000005)}</span>{" "}
              token transfers or swaps
            </li>
            <li>
              <span className="font-bold text-blue-400">~{Math.round(amount / 0.0022)}</span> token
              accounts created
            </li>
            <li>
              <span className="font-bold text-blue-400">~{Math.round(amount / 0.005)}</span> NFTs
              minted
            </li>
          </ul>
        ),
      },
      notifyId ? notifyId : null
    );
    if (!notifyId) setNotifyId(id);

    setIsFetchingQuote(true);
    try {
      const quote = await fetcher<WhirlpoolQuoteData>("/api/bonk/whirlpool-quote", {
        method: "POST",
        body: JSON.stringify({
          amountOut: amount,
          numerator: 10,
          denominator: 1000,
        }),
        headers: { "Content-type": "application/json; charset=UTF-8" },
      });

      setValue("swapAmount", Math.ceil(parseFloat(quote.estimatedAmountIn) / 0.95));
      setPriceQuote(quote);
    } catch (err) {
    } finally {
      setIsFetchingQuote(false);
    }
  };

  const handleSetMax = async () => {
    setValue("swapAmount", tokenBalance);
    setIsFetchingQuote(true);
    try {
      const quote = await fetcher<WhirlpoolQuoteData>("/api/bonk/whirlpool-quote", {
        method: "POST",
        body: JSON.stringify({
          amountIn: tokenBalance,
          numerator: 10,
          denominator: 1000,
        }),
        headers: { "Content-type": "application/json; charset=UTF-8" },
      });

      setPriceQuote(quote);
    } catch (err) {
    } finally {
      setIsFetchingQuote(false);
    }
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

      <div className="mx-auto max-w-3xl overflow-visible bg-white px-4 pb-5 sm:mb-6 sm:rounded-lg sm:p-6 sm:shadow">
        <div className="border-b border-gray-200 pb-6">
          <h1 className="mb-4 text-center font-display text-3xl font-semibold">
            Gasless{" "}
            <span className="bg-gradient-to-tr from-[#fe5e00] to-[#facc00] bg-clip-text font-sans text-transparent">
              BONK{" "}
            </span>
            Swap
          </h1>
          <p className="text-sm text-gray-500 sm:mx-8">
            You want to dive deeper into Solana&apos;s DeFi but only have $BONK in your wallet? No
            worries! Simply connect your wallet, enter the amount and we will help you fund your
            swap using $BONK itself. No Solana required!
            <br />
            2.5% of the $BONK amount that you submit for swapping will be burned! 🔥
          </p>
        </div>

        <div className="mt-4 flex gap-x-8">
          {/* Image + exchange rate */}
          <FormLeft quoteToken="BONK" />

          {/* Form */}
          <form onSubmit={handleSubmit(submitSwap)} className="flex flex-1 flex-col justify-start">
            {tokenBalance !== null && tokenBalance > 0 && (
              <span
                onClick={handleSetMax}
                className="mb-2 w-full border-b pb-2 text-right text-base"
              >
                <span className="mr-0.5 text-xs text-gray-600">Balance </span>
                <span className="font-medium text-amber-600">
                  {numberFormatter.format(tokenBalance)}
                </span>
              </span>
            )}
            <div>
              <div className="flex flex-wrap gap-x-2">
                <label className="text-base font-medium text-gray-600">You will sell:</label>
              </div>
              <div className="relative mt-2 flex w-full justify-between gap-x-2 sm:mt-1">
                <select className="inline-flex w-32 items-center rounded-md border border-transparent bg-gray-200 px-3">
                  <option>BONK</option>
                  <option>USDC</option>
                </select>

                <input
                  type="number"
                  {...register("swapAmount", {
                    required: true,
                    validate: {
                      notEnoughTokens: (value) =>
                        tokenBalance ? value <= tokenBalance || "Not enough BONK!" : true,
                    },
                    onChange: (e) => debouncedGetQuote(e?.target?.value),
                  })}
                  placeholder="0.00"
                  className={classNames(
                    "block grow rounded-md border-none border-transparent bg-gray-200 text-right font-medium text-gray-600",
                    "rounded-md placeholder:font-medium placeholder:text-gray-400",
                    "focus:outline-none focus:ring-0 sm:text-base"
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
                  {isFetchingQuote && (
                    <SpinnerIcon className="h-5 w-5 animate-spin text-gray-500" />
                  )}
                  <span className="font-medium text-gray-600">
                    {priceQuote
                      ? formatNumber.format(parseFloat(priceQuote.estimatedAmountOut), 6)
                      : "0.00"}
                  </span>
                </div>
              </div>
              {/* <div className="text-xs font-medium">Fee: 5% of the BONK amount</div> */}
            </div>

            <div className="my-2 grid w-full grid-cols-3 gap-x-2">
              {[0.1, 0.5, 1].map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={handleSolClick(amount)}
                  className={classNames(
                    "rounded-xl bg-gray-200 px-1.5 py-0.5 font-medium text-gray-500 transition-colors duration-150 hover:bg-amber-500 hover:text-white"
                  )}
                >
                  {amount} SOL
                </button>
              ))}
            </div>

            <div className="mt-6 flex w-full gap-x-2">
              <SelectMenu
                renderButton={(_, open) => (
                  <button
                    type="button"
                    className="group h-full flex-grow-0 rounded-md bg-amber-500 px-3 text-white hover:bg-amber-600"
                  >
                    <CogIcon
                      className={classNames(
                        "h-6 w-6 transition-transform duration-200 group-hover:rotate-90",
                        open && "rotate-90"
                      )}
                    />
                  </button>
                )}
                options={slippages}
                defaultOption={slippages[2]}
                onSelect={(value) => setValue("slippage", value.value)}
              />
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
              href="https://orca-so.gitbook.io/orca-developer-portal/orca/welcome"
              className="mt-1 text-right text-sm text-gray-600 hover:underline"
            >
              Swap is powered by Orca.so
            </a>
          </form>
        </div>
      </div>
    </>
  );
};

export default BonkSwap;
