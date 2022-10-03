import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import { useForm, UseFormRegisterReturn, FieldError } from "react-hook-form";

type InputGroupProps = {
  name: string;
  label: string;
  register: UseFormRegisterReturn;
  error: FieldError;
};

const classNames = (...classes: any[]) => classes.filter(Boolean).join(" ");

export const InputGroup = ({ name, label, register, error }: InputGroupProps) => {
  return (
    <>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative mt-1">
        <input
          type="text"
          id={name}
          {...register}
          className={classNames(
            "block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
            !!error &&
              "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500"
          )}
          aria-invalid={error ? "true" : "false"}
        />
        {error && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
          </div>
        )}
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600" id={error.type}>
          {error.message}
        </p>
      )}
    </>
  );
};
