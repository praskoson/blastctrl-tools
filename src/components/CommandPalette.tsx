import { Dialog, Combobox, Transition } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import { classNames } from "utils";

export const CommandPalette = ({
  isOpen,
  setIsOpen,
  navigation,
}: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  navigation: { name: string; href: string; in?: string; description?: string }[];
}) => {
  const router = useRouter();
  const [query, setQuery] = useState("");

  useEffect(() => {
    function onKeydown(event: KeyboardEvent) {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setIsOpen(!isOpen);
      }
    }
    window.addEventListener("keydown", onKeydown);
    return () => {
      window.removeEventListener("keydown", onKeydown);
    };
  }, [setIsOpen, isOpen]);

  const filteredNav = query
    ? navigation.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <Transition.Root show={isOpen} as={Fragment} afterLeave={() => setQuery("")}>
      <Dialog onClose={setIsOpen} className="fixed inset-0 overflow-y-auto p-4 pt-[25vh]">
        <Transition.Child
          enter="duration-300 ease-out"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="duration-200 ease-in"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>
        <Transition.Child
          enter="duration-300 ease-out"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="duration-200 ease-in"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Dialog.Panel
            as="div"
            className="relative mx-auto max-w-xl rounded-xl bg-white shadow-2xl ring-1 ring-black/5"
          >
            <Combobox
              as="div"
              className="divide-y divide-gray-100"
              onChange={(navItem: typeof navigation[number]) => {
                setIsOpen(false);
                router.push(navItem.href);
                /* Navigate the user to the selected page */
              }}
            >
              <div className="flex items-center px-4">
                <MagnifyingGlassIcon className="h-6 w-6 text-gray-500" />
                <Combobox.Input
                  onChange={(event) => setQuery(event.target.value)}
                  className="h-12 w-full border-0 bg-transparent text-sm text-gray-800 placeholder:text-gray-400 focus:ring-0"
                  placeholder="Search..."
                />
              </div>
              {filteredNav.length > 0 && (
                <Combobox.Options static className="max-h-96 overflow-y-auto py-4 text-sm">
                  {filteredNav.map((item) => (
                    <Combobox.Option value={item} key={item.name}>
                      {({ active }) => (
                        <div
                          className={classNames(
                            "space-x-1 px-4 py-2",
                            active ? "bg-indigo-600" : "bg-white"
                          )}
                        >
                          <span
                            className={classNames(
                              "font-medium",
                              active ? "text-white" : "text-gray-900"
                            )}
                          >
                            {item.name}
                          </span>
                          {item.in && (
                            <span className={active ? "text-indigo-200" : "text-gray-400"}>
                              in {item.in}
                            </span>
                          )}
                          {item.description && (
                            <span className={active ? "text-indigo-200" : "text-gray-400"}>
                              {item.description}
                            </span>
                          )}
                        </div>
                      )}
                    </Combobox.Option>
                  ))}
                </Combobox.Options>
              )}
              {query && filteredNav.length === 0 && (
                <p className="p-4 text-sm text-gray-500">No results found.</p>
              )}
            </Combobox>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition.Root>
  );
};
