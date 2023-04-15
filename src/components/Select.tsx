import {
  Listbox,
  Transition,
  type ListboxProps,
  type ListboxOptionsProps,
} from "@headlessui/react";
import { Fragment, forwardRef } from "react";
import { classNames } from "utils";

type CustomSelectProps<TType, TActualType> = Omit<
  ListboxProps<"div", TType, TActualType>,
  "className" | "as"
>;

const CustomSelect = <TType, TActualType>({
  children,
  ...rest
}: CustomSelectProps<TType, TActualType>) => {
  return (
    <Listbox<"div", TType, TActualType> as="div" {...rest} className="relative">
      {(props) => {
        return typeof children === "function" ? children(props) : children;
      }}
    </Listbox>
  );
};

type SelectOptionsProps = Omit<ListboxOptionsProps<"ul">, "unmount" | "as">;

const CustomSelectOptions = (props: SelectOptionsProps, ref: React.Ref<HTMLUListElement>) => {
  const { className, children, ...rest } = props;
  return (
    <Transition
      as={Fragment}
      enter="transition-opacity duration-200 origin-top-right"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition duration-150 origin-bottom-left"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <Listbox.Options
        as="ul"
        ref={ref}
        {...rest}
        className={classNames(
          "absolute left-1/2 z-20 mt-3 w-full min-w-fit -translate-x-1/2 space-y-1.5 rounded-md ",
          "bg-white p-1 shadow-xl ring-1 ring-black/20 focus:outline-none"
        )}
      >
        {typeof children === "function" ? (bag) => children(bag) : children}
      </Listbox.Options>
    </Transition>
  );
};

const SelectButton = Listbox.Button;
const SelectOption = Listbox.Option;
const SelectOptions = forwardRef(CustomSelectOptions);

export const Select = Object.assign(CustomSelect, {
  Options: SelectOptions,
  Option: SelectOption,
  Button: SelectButton,
});
