import { createQR, encodeURL, type TransactionRequestURLFields } from "@solana/pay";
import { type NextPage } from "next";
import { useEffect, useRef } from "react";

const NftQr: NextPage = () => {
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // The API URL, which will be used to create the Solana Pay URL
    // Append the reference address to the URL as a query parameter
    const { location } = window;
    const apiUrl = `${location.protocol}//${location.host}/api/greed-nft-mint?label=label&message=message&memo=memo}`;

    // Create Solana Pay URL
    const urlParams: TransactionRequestURLFields = {
      link: new URL(apiUrl),
    };
    const solanaUrl = encodeURL(urlParams);

    // Create QR code encoded with Solana Pay URL
    const qr = createQR(
      solanaUrl, // The Solana Pay URL
      512, // The size of the QR code
      "transparent" // The background color of the QR code
    );

    // Update the ref with the QR code
    if (qrRef.current) {
      qrRef.current.innerHTML = "";
      qr.append(qrRef.current);
    }
  }, []);

  return <div ref={qrRef}></div>;
};

export default NftQr;
