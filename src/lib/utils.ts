import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function chunk<T>(array: T[], size: number): T[][] {
  if (!array?.length || size < 1) {
    return [];
  }
  let index = 0,
    resIndex = 0,
    length = array.length;
  let result = Array(Math.ceil(array.length / size));

  while (index < length) {
    result[resIndex++] = array.slice(index, index + size);
    index += size;
  }
  return result;
}

export async function fetcher<T>(url: string, options?: RequestInit) {
  const res = await fetch(url, options);

  if (res.status !== 200) {
    throw new Error(res.statusText);
  }

  return (await res.json()) as T;
}
