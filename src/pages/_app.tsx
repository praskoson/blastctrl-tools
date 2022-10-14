import { AppProps } from "next/app";
import Head from "next/head";
import { FC, Fragment } from "react";
import { ContextProvider } from "../contexts/ContextProvider";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import Link from "next/link";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { classNames } from "utils";
import Image from "next/image";
import { Breadcrumbs } from "components/Breadcrumbs";
import BlastCtrlIcon from "../../public/blastctrl_icon_white.svg";
import { Jdenticon } from "components/Jdenticon";
import { Footer } from "components/Footer";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

dayjs.extend(relativeTime);
require("@solana/wallet-adapter-react-ui/styles.css");
require("../styles/globals.css");

const user = {
  name: "Floyd Miles",
  email: "floy.dmiles@example.com",
  imageUrl:
    "https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
};
const navigation = [
  { name: "NFT Tools", href: "/nft-tools" },
  { name: "Tokens", href: "/tokens" },
  { name: "Storage", href: "/storage" },
];
const userNavigation = [
  { name: "Your Profile", href: "#" },
  { name: "Settings", href: "#" },
  { name: "Sign out", href: "#" },
];

const App: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>BlastCtrl Tools</title>
      </Head>

      <ContextProvider>
        <div className="flex min-h-screen flex-col">
          <>
            <Disclosure as="nav" className="bg-primary" aria-label="Global">
              {({ open }) => (
                <>
                  <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
                    <div className="flex h-16 justify-between">
                      <div className="flex items-center px-2 lg:px-0">
                        <div className="flex flex-shrink-0 items-center">
                          <Link href="/">
                            <a>
                              <Image height={38} width={38} src={BlastCtrlIcon} alt="BlastCtrl" />
                            </a>
                          </Link>
                        </div>
                        <div className="hidden lg:ml-8 lg:flex lg:space-x-4">
                          {navigation.map((item) => (
                            <Link key={item.name} href={item.href}>
                              <a className="rounded-md py-2 px-3 text-sm font-medium text-white hover:bg-primary-focus">
                                {item.name}
                              </a>
                            </Link>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-1 items-center justify-center px-2 lg:ml-6 lg:justify-end">
                        <div className="w-full max-w-lg lg:max-w-xs">
                          <label htmlFor="search" className="sr-only">
                            Search
                          </label>
                          <div className="relative text-white focus-within:text-gray-400">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                              <MagnifyingGlassIcon
                                className="h-5 w-5 flex-shrink-0"
                                aria-hidden="true"
                              />
                            </div>
                            <input
                              id="search"
                              name="search"
                              className="block w-full rounded-md border-transparent bg-primary-focus py-2 pl-10 pr-3 text-base leading-5 placeholder-white focus:border-white focus:bg-white focus:text-gray-900 focus:placeholder-gray-400 focus:outline-none focus:ring-0 sm:text-sm"
                              placeholder="Search"
                              type="search"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center lg:hidden">
                        {/* Mobile menu button */}
                        <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-sky-200 hover:bg-sky-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                          <span className="sr-only">Open menu</span>
                          {open ? (
                            <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                          ) : (
                            <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                          )}
                        </Disclosure.Button>
                      </div>
                      <div className="hidden lg:ml-4 lg:flex lg:items-center">
                        {/* Profile dropdown */}
                        <Menu as="div" className="relative ml-4 flex-shrink-0">
                          <div>
                            <Menu.Button className="flex rounded-full bg-sky-500 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-sky-500">
                              <span className="sr-only">Open user menu</span>
                              <WalletMultiButton />
                              {/* <Jdenticon size="32px" /> */}
                            </Menu.Button>
                          </div>
                          <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                          >
                            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                              {userNavigation.map((item) => (
                                <Menu.Item key={item.name}>
                                  {({ active }) => (
                                    <a
                                      href={item.href}
                                      className={classNames(
                                        active ? "bg-gray-100" : "",
                                        "block px-4 py-2 text-sm text-gray-700"
                                      )}
                                    >
                                      {item.name}
                                    </a>
                                  )}
                                </Menu.Item>
                              ))}
                            </Menu.Items>
                          </Transition>
                        </Menu>
                      </div>
                    </div>
                  </div>

                  <Disclosure.Panel className="lg:hidden">
                    <div className="space-y-1 px-2 pt-2 pb-3">
                      {navigation.map((item) => (
                        <Disclosure.Button
                          key={item.name}
                          as="a"
                          href={item.href}
                          className="block rounded-md py-2 px-3 text-base font-medium text-white hover:bg-sky-400 hover:text-white"
                        >
                          {item.name}
                        </Disclosure.Button>
                      ))}
                    </div>
                    <div className="border-t border-sky-500 pt-4 pb-3">
                      <div className="flex items-center px-4">
                        <WalletMultiButton />
                        {/* <div className="flex-shrink-0">
                          <img className="h-10 w-10 rounded-full" src={user.imageUrl} alt="" />
                        </div>
                        <div className="ml-3">
                          <div className="text-base font-medium text-white">{user.name}</div>
                          <div className="text-sm font-medium text-sky-200">{user.email}</div>
                        </div> */}
                      </div>
                      <div className="mt-3 px-2">
                        {userNavigation.map((item) => (
                          <Disclosure.Button
                            key={item.name}
                            as="a"
                            href={item.href}
                            className="block rounded-md py-2 px-3 text-base font-medium text-sky-200 hover:bg-sky-400 hover:text-white"
                          >
                            {item.name}
                          </Disclosure.Button>
                        ))}
                      </div>
                    </div>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          </>
          <Breadcrumbs />
          <main className="mx-auto max-w-7xl flex-grow px-4 pt-10 pb-12 lg:pb-16">
            <Component {...pageProps} />
          </main>
          <Footer />
        </div>
      </ContextProvider>
    </>
  );
};

export default App;
