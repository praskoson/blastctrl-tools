import { NextPage } from "next";
import Link from "next/link";
import { classNames } from "utils";

const Tokens: NextPage = () => {
  const navigation = [
    {
      name: "Recover nested token accounts",
      href: "/tokens/recover-nested",
      description: "Recover tokens stuck in nested associated token accounts.",
      active: true,
    },
    {
      name: "Create fungible tokens",
      href: "/tokens/create-token",
      description: "Add metadata to fungible tokens",
      active: true,
    },
    {
      name: "Close empty accounts",
      href: "/tokens/close-empty",
      description:
        "Attempt to close your empty token accounts, recovering the SOL used to open them.",
      active: false,
    },
  ];
  return (
    <>
      <h3 className="pb-4">Tools for managing tokens and token accounts</h3>
      <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-4">
        {navigation.map((navItem) => (
          <Link key={navItem.name} href={navItem.active ? navItem.href : "#"}>
            <a
              className={classNames(
                "block cursor-pointer rounded-md border border-gray-300 bg-white p-4 transition-all duration-75",
                "hover:bg-indigo-100 hover:ring-2 hover:ring-indigo-600 focus:outline-none",
                !navItem.active && "pointer-events-none"
              )}
            >
              <div className="flex items-center justify-between">
                <span className="block text-base font-medium text-gray-900">{navItem.name}</span>
                {!navItem.active && (
                  <span className="inline-flex rotate-2 items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                    Under construction
                  </span>
                )}
              </div>
              <span
                className={classNames(
                  "mt-1 flex items-center text-sm text-gray-500",
                  !navItem.active && "blur-[2px]"
                )}
              >
                {navItem.description}
              </span>
            </a>
          </Link>
        ))}
      </div>
    </>
  );
};

export default Tokens;
