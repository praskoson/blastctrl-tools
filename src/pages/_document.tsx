import Document, { DocumentContext, Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);

    return initialProps;
  }

  render() {
    return (
      <Html>
        <Head>
          <link rel="shortcut icon" href="/favicon.ico" />
          <link
            href="https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@700&family=Roboto:wght@300;400;500;600;700&display=swap"
            rel="stylesheet"
          />
          <meta
            name="description"
            content="A set of tools for easier token and NFT manipulation on Solana."
          />
          <meta
            name="keywords"
            content="solana, blockchain, crypto, cryptocurrency, nft, defi, gaming, investing, fund, project, management, consulting, advice, ventures, capital, help, fundraising, tokenomics, business, strategy"
          />
          <meta name="theme-color" content="#e52525" />

          <meta name="twitter:card" content="summary_large_image" />
          <meta property="twitter:url" content="https://tools.blastctrl.com/" />
          <meta name="twitter:title" content="Blockchain Consulting | Blast Ctrl" />
          <meta
            name="twitter:description"
            content="A set of tools for easier token and NFT manipulation on Solana."
          />
          <meta name="twitter:image" content="https://cdn.blastctrl.com/bc/img/WebsiteTagPic.png" />

          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://blastctrl.com/" />
          <meta property="og:title" content="Blockchain Consulting | Blast Ctrl" />
          <meta
            property="og:description"
            content="Blast Ctrl specializes in providing full support in launching and running crypto projects on Solana. From product strategy and tokenomics to fundraising and partnerships, don't wait to get the perfect advice."
          />
          <meta property="og:image" content="https://cdn.blastctrl.com/bc/img/WebsiteTagPic.png" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
