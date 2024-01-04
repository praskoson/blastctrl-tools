import Image from "next/image";
import Link from "next/link";
import { type ReactNode } from "react";
import BlastCtrlIcon from "../../public/blastctrl_icon_white.svg";
import { Breadcrumbs } from "./ui/breadcrumbs";
import { Roboto } from "next/font/google";

import "styles/globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
  weight: ["300", "400", "500", "700"],
});

const navigation = [
  {
    name: "NFT Tools",
    href: "/solana-nft-tools",
    description: "Run common Metaplex instructions",
  },
  { name: "Tokens", href: "/spl-token-tools", description: "Manage token accounts" },
  {
    name: "Permanent Storage",
    href: "/permanent-storage-tools",
    description: "Decentralized file hosting",
  },
];

export default function RootLayout({ children }: { children?: ReactNode }) {
  return (
    <html lang="en" style={{ ...roboto.style }}>
      <body className={`${roboto.variable} text-foreground`}>
        <header className="bg-primary h-16">
          <div className="h-full flex items-center w-full max-w-7xl mx-auto">
            <Link href="/">
              <Image height={38} width={38} src={BlastCtrlIcon} alt="BlastCtrl" />
            </Link>

            <nav className="h-full hidden lg:ml-6 lg:flex lg:gap-4 items-center">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="rounded-md px-3 py-2 font-medium text-white hover:bg-primary-focus"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <Breadcrumbs />
        {children}
      </body>
    </html>
  );
}
