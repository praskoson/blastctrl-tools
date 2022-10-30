// https://github.com/metaplex-foundation/js

import { WebBundlr } from "@bundlr-network/client";
import {
  Connection,
  PublicKey,
  SendOptions,
  Transaction,
  TransactionSignature,
  Signer,
} from "@solana/web3.js";
import BigNumber from "bignumber.js";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { Amount, lamports, toBigNumber } from "types";

export type BundlrOptions = {
  address?: string;
  timeout?: number;
  providerUrl?: string;
  priceMultiplier?: number;
  identity?: WalletContextState;
};

export type BundlrWalletAdapter = {
  publicKey: PublicKey | null;
  signMessage?: (message: Uint8Array) => Promise<Uint8Array>;
  signTransaction?: (transaction: Transaction) => Promise<Transaction>;
  signAllTransactions?: (transactions: Transaction[]) => Promise<Transaction[]>;
  sendTransaction: (
    transaction: Transaction,
    connection: Connection,
    options?: SendOptions & { signers?: Signer[] }
  ) => Promise<TransactionSignature>;
};

export class BundlrStorageDriver {
  protected _connection: Connection;
  protected _identity: WalletContextState;
  protected _bundlr: WebBundlr | null = null;
  protected _options: BundlrOptions;

  constructor(connection: Connection, identity: WalletContextState, options: BundlrOptions = {}) {
    this._connection = connection;
    this._identity = identity;
    this._options = {
      providerUrl: connection.rpcEndpoint,
      ...options,
    };
  }

  async initBundlr(): Promise<WebBundlr> {
    let wallet: BundlrWalletAdapter;
    if (this._identity && this._identity.connected) {
      wallet = {
        publicKey: this._identity.publicKey,
        signMessage: (message: Uint8Array) => this._identity.signMessage(message),
        signTransaction: (transaction: Transaction) => this._identity.signTransaction(transaction),
        signAllTransactions: (transactions: Transaction[]) =>
          this._identity.signAllTransactions(transactions),
        sendTransaction: (
          transaction: Transaction,
          connection: Connection,
          options: SendOptions & { signers?: Signer[] } = {}
        ): Promise<TransactionSignature> => {
          const { signers, ...sendOptions } = options;
          return this._identity.sendTransaction(transaction, connection, sendOptions);
        },
      };
    } else {
      wallet = undefined;
    }

    const bundlr = new WebBundlr(this._options.address, "solana", wallet, this._options);

    try {
      // Try to initiate bundlr.
      await bundlr.ready();
    } catch (error) {
      //   throw new FailedToInitializeBundlrError({ cause: error as Error });
      throw new Error("Failed to initialize bundlr", { cause: error as Error });
    }

    return bundlr;
  }

  async bundlr(): Promise<WebBundlr> {
    if (this._bundlr) {
      return this._bundlr;
    }

    return (this._bundlr = await this.initBundlr());
  }

  async getBalance(): Promise<Amount> {
    const bundlr = await this.bundlr();
    const balance = await bundlr.getLoadedBalance();

    return bigNumberToAmount(balance);
  }

  async getUploadPrice(bytes: number): Promise<Amount> {
    const bundlr = await this.bundlr();
    const price = await bundlr.getPrice(bytes);

    return bigNumberToAmount(price.multipliedBy(this._options.priceMultiplier ?? 1.5));
  }

  async fund(amount: Amount, skipBalanceCheck = false): Promise<void> {
    const bundlr = await this.bundlr();
    let toFund = amountToBigNumber(amount);

    if (!skipBalanceCheck) {
      const balance = await bundlr.getLoadedBalance();

      toFund = toFund.isGreaterThan(balance) ? toFund.minus(balance) : new BigNumber(0);
    }

    if (toFund.isLessThanOrEqualTo(0)) {
      return;
    }

    await bundlr.fund(toFund);
  }

  async withdrawAll(): Promise<void> {
    const bundlr = await this.bundlr();
    const balance = await bundlr.getLoadedBalance();
    const minimumBalance = new BigNumber(5000);

    if (balance.isLessThan(minimumBalance)) {
      throw Error(`Withdraw error: insufficient balance.`);
    }

    const balanceToWithdraw = balance.minus(minimumBalance);
    await this.withdraw(bigNumberToAmount(balanceToWithdraw));
  }

  async withdraw(amount: Amount): Promise<void> {
    const bundlr = await this.bundlr();

    const { status } = await bundlr.withdrawBalance(amountToBigNumber(amount));

    if (status >= 300) {
      //   throw new BundlrWithdrawError(status);
      throw Error(`Error withdrawing from bundlr, returned status: ${status}`);
    }
  }

  async upload(file: File): Promise<string> {
    const [uri] = await this.uploadAll([file]);

    return uri;
  }

  async uploadAll(files: File[]): Promise<string[]> {
    const bundlr = await this.bundlr();
    const amount = await this.getUploadPrice(files.reduce((sum, file) => (sum += file.size), 0));
    await this.fund(amount);

    const promises = files.map(async (file) => {
      const buffer = await file.arrayBuffer();
      const { status, data } = await bundlr.uploader.upload(Buffer.from(buffer), {
        tags: [{ name: "Content-Type", value: file.type }],
      });

      if (status >= 300) {
        // throw new AssetUploadFailedError(status);
        throw Error(`Failed to upload asset, returned error code: ${status}`);
      }

      return `https://arweave.net/${data.id}`;
    });

    return await Promise.all(promises);
  }
}

const bigNumberToAmount = (bigNumber: BigNumber): Amount => {
  return lamports(toBigNumber(bigNumber.decimalPlaces(0).toString()));
};

const amountToBigNumber = (amount: Amount): BigNumber => {
  return new BigNumber(amount.basisPoints.toString());
};
