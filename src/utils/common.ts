export function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export const zipMap = <T, U, V>(
  left: T[],
  right: U[],
  fn: (t: T, u: U | null, i: number) => V
): V[] => left.map((t: T, index) => fn(t, right?.[index] ?? null, index));

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
