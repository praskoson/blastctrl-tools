import { useState } from "react";
import { AddTo } from "./AddTo";
import { RemoveFrom } from "./RemoveFrom";

export const CollectionsView = () => {
  const [tab, setTab] = useState<"add" | "remove">("add");

  return (
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
  );
};
