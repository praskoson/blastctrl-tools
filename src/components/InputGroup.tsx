import React, { ReactNode } from "react";
import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import { FieldError } from "react-hook-form";
import { classNames } from "utils";

export interface InputGroupProps extends React.ComponentPropsWithoutRef<"input"> {
  label: string;
  description?: string | ReactNode;
  leading?: ReactNode;
  error?: FieldError;
  className?: string;
}

export const InputGroup = React.forwardRef<HTMLInputElement, InputGroupProps>(function InputGroup(
  props,
  ref
) {
  const { label, description, leading, error, className, type, ...rest } = props;

  const leadingAddOn = leading ? (
    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
      <span className={`${error ? "text-red-300" : "text-gray-400"} sm:text-sm`}>{leading}</span>
    </div>
  ) : null;

  return (
    <div className={className}>
      <label htmlFor={rest.name} className="block space-x-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        {description && <span className="text-xs font-normal text-gray-500">{description}</span>}
      </label>
      <div className="relative mt-1 rounded-md shadow-sm">
        {leadingAddOn}
        <input
          ref={ref}
          type={type}
          id={rest.name}
          {...rest}
          className={classNames(
            "block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
            leading && "pl-7",
            !!error &&
              "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500"
          )}
          aria-invalid={error ? "true" : "false"}
        />
        {error && (
          <div
            className={`pointer-events-none absolute inset-y-0 right-0 flex items-center ${
              type === "number" ? "pr-8" : "pr-3"
            }`}
          >
            <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
          </div>
        )}
      </div>
      {error?.message && (
        <p className="mt-2 text-sm text-red-600" id={error?.type}>
          {error?.message}
        </p>
      )}
    </div>
  );
});
