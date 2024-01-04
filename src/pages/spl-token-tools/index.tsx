import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { classNames } from "utils";

const Tokens: NextPage = () => {
  const navigation = [
    {
      name: "Recover nested token accounts",
      href: "/spl-token-tools/recover-nested",
      description: "Recover tokens stuck in nested associated token accounts.",
      active: true,
    },
    {
      name: "Add/update metadata on tokens",
      href: "/spl-token-tools/create-token",
      description:
        "Add or update on chain metadata for fungible tokens. Intended to be used with tokens made with the old SPL Token program, not 22.",
      active: true,
    },
    {
      name: "Close empty accounts",
      href: "/spl-token-tools/close-empty",
      description:
        "Attempt to close your empty token accounts, recovering the SOL used to open them.",
      active: false,
    },
  ];
  return (
    <>
      <Head>
        <title>SPL token tools | BlastTools</title>
      </Head>
      <h1 className="pb-4">Tools for managing SPL tokens and token accounts.</h1>
      <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-4">
        {navigation.map((navItem) => (
          <Link
            key={navItem.name}
            href={navItem.active ? navItem.href : "#"}
            className={classNames(
              "block cursor-pointer rounded-md border border-gray-300 bg-white p-4 transition-all duration-75",
              "hover:bg-indigo-100 hover:ring-2 hover:ring-indigo-600 focus:outline-none",
              !navItem.active && "pointer-events-none"
            )}
          >
            <div className="flex items-center justify-between">
              <h2 className="block text-base font-medium text-gray-900">{navItem.name}</h2>
              {!navItem.active && (
                <span className="inline-flex rotate-2 items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                  Under construction
                </span>
              )}
            </div>
            <h3
              className={classNames(
                "mt-1 flex items-center text-sm text-gray-500",
                !navItem.active && "blur-[2px]"
              )}
            >
              {navItem.description}
            </h3>
          </Link>
        ))}
      </div>
    </>
  );
};

export default Tokens;
