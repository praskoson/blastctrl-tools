import type { NextPage } from "next";
import Head from "next/head";
import { Tab} from "@headlessui/react"
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

        <Tab.Group defaultIndex={0} as="div" className="max-w-xl rounded-md flex flex-col w-full overflow-visible">
          <Tab.List className="w-full sm:pb-0 pb-2.5 bg-indigo-100/20 grid grid-cols-2 items-stretch overflow-hidden text-gray-500">
            {({ selectedIndex }) => (
              <>
              {["Add", "Remove"].map((tab, i) => (
                <Tab key={tab} className={classNames("hover:bg-indigo-200/50 border-b-2 rounded-tl-md pt-2 py-1.5", 
                selectedIndex === i ? "border-indigo-700 font-medium text-gray-900" : "font-normal text-gray-500 border-transparent")}>{tab}</Tab>
              ))}
              </>
            )}
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel><AddTo /></Tab.Panel>
            <Tab.Panel><RemoveFrom /></Tab.Panel>
          </Tab.Panels>
        </Tab.Group>      
    </>
  );
};

export default Collections;
