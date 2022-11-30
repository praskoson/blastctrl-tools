import { Tab } from "@headlessui/react";
import { NextPage } from "next";
import Head from "next/head";
import { Fragment } from "react";
import { classNames } from "utils";
import { AutomaticRecover } from "views/tokens-manual/automatic";

import { ManualInput } from "views/tokens-manual/manual-input";

const tabs = [{ name: "Manual Input" }, { name: "Automatic" }];

const RecoverNested: NextPage = () => {
  return (
    <>
      <Head>
        <title>Tools | Blast Ctrl - Recover Nested</title>
        <meta name="Metaplex NFT" content="Basic Functionality" />
      </Head>
      <div className="mx-auto max-w-xl overflow-visible bg-white px-4 pb-5 sm:mb-6 sm:rounded-lg sm:p-6 sm:shadow">
        <h1 className="mb-4 font-display text-3xl font-semibold">Recover Nested Token Accounts</h1>

        <Tab.Group>
          <div className="pb-4">
            <Tab.List className="isolate flex divide-x divide-gray-200 shadow" aria-label="Tabs">
              {tabs.map((tab) => (
                <Tab as={Fragment} key={tab.name}>
                  {({ selected }) => (
                    <button
                      className={classNames(
                        selected
                          ? "bg-indigo-50 text-gray-900"
                          : "text-gray-500 hover:text-gray-700",
                        selected ? "hover:bg-indigo-100" : "hover:bg-indigo-50",
                        "group relative min-w-0 flex-1 overflow-hidden bg-white py-2 px-4 text-center text-sm font-medium focus:z-10"
                      )}
                      aria-current={selected ? "page" : undefined}
                    >
                      <span className="">{tab.name}</span>
                      <span
                        aria-hidden="true"
                        className={classNames(
                          selected ? "bg-indigo-500" : "bg-transparent",
                          "absolute inset-x-0 bottom-0 h-0.5"
                        )}
                      />
                    </button>
                  )}
                </Tab>
              ))}
            </Tab.List>
          </div>
          <Tab.Panels>
            <Tab.Panel>
              <ManualInput />
            </Tab.Panel>
            <Tab.Panel>
              <AutomaticRecover />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </>
  );
};

export default RecoverNested;
