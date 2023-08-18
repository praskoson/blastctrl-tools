import type { NextPage } from "next";
import Head from "next/head";
import { Tab } from "@headlessui/react";
import { AddTo } from "views/collections/AddTo";
import { RemoveFrom } from "views/collections/RemoveFrom";
import { classNames } from "utils";

const Collections: NextPage = () => {
  return (
    <>
      <Head>
        <title>Tools | BlastTools - Collections</title>
        <meta name="Metaplex Collections" content="Basic Functionality" />
      </Head>

      <Tab.Group
        defaultIndex={0}
        as="div"
        className="flex w-full max-w-xl flex-col overflow-visible rounded-md"
      >
        <Tab.List className="grid w-full grid-cols-2 items-stretch overflow-hidden bg-indigo-100/20 pb-2.5 text-gray-500 sm:pb-0">
          {({ selectedIndex }) => (
            <>
              {["Add", "Remove"].map((tab, i) => (
                <Tab
                  key={tab}
                  className={classNames(
                    "rounded-tl-md border-b-2 py-1.5 pt-2 hover:bg-indigo-200/50",
                    selectedIndex === i
                      ? "border-indigo-700 font-medium text-gray-900"
                      : "border-transparent font-normal text-gray-500"
                  )}
                >
                  {tab}
                </Tab>
              ))}
            </>
          )}
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            <AddTo />
          </Tab.Panel>
          <Tab.Panel>
            <RemoveFrom />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </>
  );
};

export default Collections;
