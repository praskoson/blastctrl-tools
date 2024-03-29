import { Switch } from "@headlessui/react";
import { useController, UseControllerProps } from "react-hook-form";
import { FormInputs } from "pages/solana-nft-tools/update";

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

type SwitchButtonProps = {
  label?: string;
  description?: string;
  props: UseControllerProps<FormInputs>;
};

export const SwitchButton = ({ label, description, props }: SwitchButtonProps) => {
  const {
    field: { value, onChange, ref },
  } = useController(props);

  return (
    <Switch.Group as="div" className="flex items-center justify-between">
      {label && (
        <span className="flex flex-grow flex-col">
          <Switch.Label as="span" className="text-sm font-medium text-gray-900" passive>
            {label}
          </Switch.Label>
          {description && (
            <Switch.Description as="span" className="text-sm text-gray-500">
              {description}
            </Switch.Description>
          )}
        </span>
      )}
      <Switch
        ref={ref}
        checked={!!value}
        onChange={onChange}
        className={classNames(
          !!value ? "bg-indigo-600" : "bg-gray-200",
          "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        )}
      >
        <span
          aria-hidden="true"
          className={classNames(
            !!value ? "translate-x-5" : "translate-x-0",
            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
          )}
        />
      </Switch>
    </Switch.Group>
  );
};
