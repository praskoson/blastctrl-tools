import { PublicKey } from "@solana/web3.js";

export const tokenList = [
  {
    name: "USD Coin",
    ticker: "USDC",
    mintAddress: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    decimals: 6,
    image:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
  },
  {
    name: "USD Tether",
    ticker: "USDT",
    mintAddress: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
    decimals: 6,
    image:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.svg",
  },
  {
    name: "devUNLOC",
    ticker: "devUNLOC",
    mintAddress: "Bt8KVz26uLrXrMzRKaJgX9rYd2VcfBh8J67D4s3kRmut",
    decimals: 6,
    image: "https://www.arweave.net/s1kfGqGqIapXRYVwXwQMd6aDYGXOJ4MH_rsp9CQSckI?ext=png",
  },
  {
    name: "Metaplex",
    ticker: "MPLX",
    mintAddress: "METAewgxyPbgwsseH8T16a39CQ5VyVxZi9zXiDPY18m",
    decimals: 6,
    image: "https://www.arweave.net/VRKOcXIvCxqp35RZ9I0-bDGk5qNfT46OTho-2oP9iGc",
  },
  {
    name: "Samoyedcoin",
    ticker: "SAMO",
    mintAddress: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    decimals: 9,
    image: "https://assets.coingecko.com/coins/images/15051/large/IXeEj5e.png",
  },
];

export const findTokenByMint = (address: string | PublicKey) => {
  const result = tokenList.find((token) => token.mintAddress === address.toString());
  return result;
};
