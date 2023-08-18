import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { Tab} from "@headlessui/react"
import { AddTo } from "views/collections/AddTo";
import { RemoveFrom } from "views/collections/RemoveFrom";

const Collections: NextPage = () => {
  const [tab, setTab] = useState<"add" | "remove">("add");

  return (
    <div>
      <Head>
        <title>Tools | BlastTools - Collections</title>
        <meta name="Metaplex Collections" content="Basic Functionality" />
      </Head>
      <div className="mx-auto p-4 md:hero">
        <div className="flex flex-col md:hero-content">
          <div className="tabs">
            <a
              className={`tab tab-bordered ${tab === "add" ? "tab-active" : ""}`}
              onClick={() => setTab("add")}
            >
              Add
            </a>
            <a
              className={`tab tab-bordered ${tab === "remove" ? "tab-active" : ""}`}
              onClick={() => setTab("remove")}
            >
              Remove
            </a>
          </div>
          <div className="text-left">
            {tab === "add" && <AddTo />}
            {tab === "remove" && <RemoveFrom />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collections;
