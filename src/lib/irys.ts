import { WebIrys } from "@irys/sdk";
import { type UploadResponse } from "@irys/sdk/build/cjs/common/types";
import { type MessageSignerWalletAdapter } from "@solana/wallet-adapter-base";
import { WalletContextState } from "@solana/wallet-adapter-react";
import BigNumber from "bignumber.js";
import { Amount, lamports, toBigNumber } from "types";

const nodes = {
  "mainnet-beta": ["https://node1.irys.xyz", process.env.NEXT_PUBLIC_RPC_ENDPOINT!],
  devnet: ["https://devnet.irys.xyz", "https://api.devnet.solana.com"],
};

// export const getWebIrys = async (network: string, provider: MessageSignerWalletAdapter) => {
//   const [irysNode, rpcUrl] = nodes[network] ?? nodes["mainnet-beta"];
//   const wallet = { rpcUrl, name: "solana", provider };
//   const webIrys = new WebIrys({ url: irysNode, token: "solana", wallet });
//   await webIrys.ready();

//   return webIrys;
// };

// export const uploadFile = async (irys: WebIrys, file: File) => {
//   const tags = [{ name: "Content-Type", value: file.type }];
//   const amount = await irys.getPrice(file.size);
//   await irys.fund(amount, 1.5);
//   const response = await irys.uploadFile(file, { tags });

//   console.log(`File uploaded ==> https://gateway.irys.xyz/${response.id}`);
//   return response;
// };

// export const getBalance = async (irys: WebIrys) => {
//   const balance = await irys.getLoadedBalance();

//   return bigNumberToAmount(balance);
// };

// export const getUploadPrice = async (irys: WebIrys, bytes: number): Promise<Amount> => {
//   const price = await irys.getPrice(bytes);

//   return bigNumberToAmount(price.multipliedBy(1.5));
// };

// export const withdrawAll = async (irys: WebIrys) => {
//   const balance = await irys.getLoadedBalance();
//   const minimumBalance = new BigNumber(5000);

//   if (balance.isLessThan(minimumBalance)) {
//     throw Error(`Withdraw error: insufficient balance.`);
//   }

//   const balanceToWithdraw = balance.minus(minimumBalance);
//   return irys.withdrawBalance(balanceToWithdraw);
// };

export class IrysStorage {
  private webIrys: WebIrys;
  private constructor(irys: WebIrys) {
    this.webIrys = irys;
  }

  static async makeWebIrys(network: string, provider: WalletContextState) {
    const [irysNode, rpcUrl] = nodes[network] ?? nodes["mainnet-beta"];
    const wallet = { rpcUrl, name: "solana", provider };
    const webIrys = new WebIrys({ url: irysNode, token: "solana", wallet });
    await webIrys.ready();
    return new IrysStorage(webIrys);
  }

  async uploadFile(file: File): Promise<UploadResponse> {
    const tags = [{ name: "Content-Type", value: file.type }];
    const amount = await this.webIrys.getPrice(file.size);
    await this.webIrys.fund(amount, 1.5);
    const response = await this.webIrys.uploadFile(file, { tags });

    console.log(`File uploaded ==> https://gateway.irys.xyz/${response.id}`);
    return response;
  }

  async getBalance() {
    const balance = await this.webIrys.getLoadedBalance();

    return bigNumberToAmount(balance);
  }

  async getUploadPrice(bytes: number): Promise<Amount> {
    const price = await this.webIrys.getPrice(bytes);

    return bigNumberToAmount(price.multipliedBy(1.5));
  }

  async withdrawAll() {
    const balance = await this.webIrys.getLoadedBalance();
    const minimumBalance = new BigNumber(5000);

    if (balance.isLessThan(minimumBalance)) {
      throw Error(`Withdraw error: insufficient balance.`);
    }

    const balanceToWithdraw = balance.minus(minimumBalance);
    return this.webIrys.withdrawBalance(balanceToWithdraw);
  }
}

function bigNumberToAmount(bigNumber: BigNumber): Amount {
  return lamports(toBigNumber(bigNumber.decimalPlaces(0).toString()));
}

function amountToBigNumber(amount: Amount): BigNumber {
  return new BigNumber(amount.basisPoints.toString());
}
